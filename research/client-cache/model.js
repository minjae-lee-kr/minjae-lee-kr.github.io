import { PIN } from "./pin.js";

export const caseIds = [
  "all-cold",
  "none-warm",
  "all-warm",
  "ignore-warm",
  "all-no-cache",
];
export const detailIds = ["case-raw", "provenance-raw"];
const skus = ["demo-notebook", "demo-lamp", "demo-ceramic"];
const lampKey = 'Product:{"sku":"demo-lamp"}';
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function requireFact(condition, message) {
  if (!condition) throw new Error(`Recording contract: ${message}`);
}
export function readState(search = "") {
  const p = new URLSearchParams(search);
  return {
    id: caseIds.includes(p.get("case")) ? p.get("case") : caseIds[0],
    details: (p.get("details") || "")
      .split(",")
      .filter((id, i, all) => detailIds.includes(id) && all.indexOf(id) === i),
  };
}
export function stateSearch(state, language) {
  requireFact(caseIds.includes(state.id), "unknown case");
  const p = new URLSearchParams({
    case: state.id,
    lang: language === "ko" ? "ko" : "en",
  });
  const details = detailIds.filter((id) => state.details.includes(id));
  if (details.length) p.set("details", details.join(","));
  return `?${p}`;
}
function quantity(availability) {
  if (availability === null) return { kind: "null" };
  requireFact(
    availability && Number.isInteger(availability.quantity),
    "missing availability value",
  );
  return { kind: "quantity", quantity: availability.quantity };
}
function productValue(data) {
  requireFact(
    data &&
      Array.isArray(data.products) &&
      same(
        data.products.map((p) => p?.sku),
        skus,
      ),
    "product identities",
  );
  requireFact(
    Object.hasOwn(data.products[1], "availability"),
    "missing lamp field",
  );
  return quantity(data.products[1].availability);
}
function cacheValue(cache, read) {
  requireFact(
    cache && typeof cache === "object" && !Array.isArray(cache),
    "cache snapshot",
  );
  if (Object.keys(cache).length === 0) {
    requireFact(read === null, "empty cache must have no readable query");
    return { kind: "empty" };
  }
  requireFact(cache[lampKey]?.sku === "demo-lamp", "normalized lamp identity");
  const value = quantity(cache[lampKey].availability);
  requireFact(same(value, productValue(read)), "cache and readAfter disagree");
  return value;
}
function errorPresent(error) {
  if (error === null) return false;
  requireFact(
    error?.name === "CombinedGraphQLErrors" &&
      error.dataPresent === true &&
      error.errors?.length === 1 &&
      same(error.errors[0].path, ["products", 1, "availability"]) &&
      productValue(error.data).kind === "null",
    "GraphQL error and partial data",
  );
  return true;
}

// This is a fixed-capture reader contract, not a substitute for the source checker.
// Exposed separately so tests can challenge interpretation beyond the hash fence.
export function projectReport(report, pin = PIN) {
  requireFact(
    report?.version === 1 && report.kind === "client-cache-boundary",
    "report identity",
  );
  requireFact(
    report.sourceUnchanged === true &&
      same(report.sourceBefore, report.sourceAfter),
    "source changed",
  );
  requireFact(
    report.sourceBefore?.git?.head === pin.revision &&
      report.sourceBefore.git.dirty === pin.dirty &&
      report.sourceBefore.sha256 === pin.source,
    "source pin",
  );
  requireFact(
    pin.status !== "published" || pin.dirty === false,
    "published capture is dirty",
  );
  requireFact(
    report.assessment?.evidenceValid === true &&
      report.assessment.violations?.length === 0,
    "source assessment failed",
  );
  requireFact(
    report.tooling?.packages?.["@apollo/client"] === "4.3.3" &&
      report.tooling.packages.graphql === "16.14.2",
    "tool versions",
  );
  requireFact(
    same(report.variables?.skus, skus) &&
      same(report.cacheConfiguration?.typePolicies, {
        Product: { keyFields: ["sku"] },
        Merchant: { keyFields: ["id"] },
      }),
    "query or cache identity",
  );
  requireFact(
    Array.isArray(report.cases) &&
      same(
        report.cases.map((c) => c.id),
        caseIds,
      ),
    "case inventory",
  );
  const views = report.cases.map((item, caseIndex) => {
    const warm = item.id.endsWith("-warm");
    const none = item.id === "none-warm";
    const ignore = item.id === "ignore-warm";
    const noCache = item.id === "all-no-cache";
    const policy = none ? "none" : ignore ? "ignore" : "all";
    const labels = warm
      ? ["warm", "failed", "cache-first"]
      : ["failed", "cache-first"];
    requireFact(
      Array.isArray(item.steps) &&
        same(
          item.steps.map((s) => s.label),
          labels,
        ),
      "step inventory",
    );
    let previousCache = {};
    const steps = item.steps.map((s, stepIndex) => {
      const isWarm = s.label === "warm";
      const isNext = s.label === "cache-first";
      const expectedHttp = isNext && !noCache ? 0 : 1;
      requireFact(
        s.endpoint === (isWarm ? "healthy" : "failure") &&
          s.errorPolicy === policy &&
          s.fetchPolicy ===
            (isNext ? "cache-first" : noCache ? "no-cache" : "network-only"),
        "step policy",
      );
      requireFact(same(s.cacheBefore, previousCache), "cache continuity");
      requireFact(
        Array.isArray(s.http) && s.http.length === expectedHttp,
        "HTTP observation coverage",
      );
      for (const h of s.http)
        requireFact(
          h.endpoint === s.endpoint &&
            h.transportError === null &&
            h.request?.method === "POST" &&
            typeof h.request.bodyText === "string" &&
            h.response?.status === 200 &&
            typeof h.response.bodyText === "string",
          "HTTP observation",
        );
      const rejected = none && s.label === "failed";
      requireFact(
        s.result?.status === (rejected ? "rejected" : "resolved") &&
          s.result.dataPresent === !rejected,
        "promise outcome",
      );
      requireFact(
        !rejected || s.result.data === null,
        "rejected promise has no resolved data",
      );
      const hasError = errorPresent(s.result.error);
      requireFact(
        hasError === (!isWarm && !ignore && (!isNext || noCache)),
        "result error",
      );
      const resultValue = rejected
        ? { kind: "no-result" }
        : productValue(s.result.data);
      const cached = cacheValue(s.cacheAfter, s.readAfter);
      const expectedCache =
        noCache && !isNext
          ? { kind: "empty" }
          : isWarm || none
            ? { kind: "quantity", quantity: 3 }
            : { kind: "null" };
      requireFact(same(cached, expectedCache), "cache transition");
      requireFact(
        rejected ||
          same(
            resultValue,
            isWarm || none
              ? { kind: "quantity", quantity: 3 }
              : { kind: "null" },
          ),
        "returned inventory",
      );
      if (expectedHttp === 0)
        requireFact(
          same(s.cacheBefore, s.cacheAfter),
          "cache hit changed stored values",
        );
      previousCache = s.cacheAfter;
      return {
        label: s.label,
        pointer: `/cases/${caseIndex}/steps/${stepIndex}`,
        fetchPolicy: s.fetchPolicy,
        errorPolicy: policy,
        status: s.result.status,
        resultValue,
        hasError,
        cached,
        httpCount: s.http.length,
        errorData: s.result.error?.dataPresent
          ? productValue(s.result.error.data)
          : null,
      };
    });
    return {
      id: item.id,
      warm,
      steps,
      failed: steps.at(-2),
      next: steps.at(-1),
      pointer: `/cases/${caseIndex}`,
      raw: structuredClone(item),
    };
  });
  return {
    generatedAt: report.generatedAt,
    tooling: structuredClone(report.tooling),
    provenance: {
      revision: pin.revision,
      source: pin.source,
      dirty: pin.dirty,
      status: pin.status,
    },
    project(id) {
      requireFact(caseIds.includes(id), "unknown case");
      return structuredClone(views[caseIds.indexOf(id)]);
    },
  };
}
export async function readRecording(bytes) {
  const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
  requireFact(hash === PIN.sha256, "recording hash mismatch");
  const report = JSON.parse(
    new TextDecoder("utf-8", { fatal: true }).decode(bytes),
  );
  const recording = projectReport(report);
  return { ...recording, hash };
}
