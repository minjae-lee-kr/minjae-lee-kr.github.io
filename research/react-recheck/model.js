import { PIN } from "./pin.js";
export const detailIds = ["step-detail", "provenance-detail"];
export const phases = ["warm", "failed", "cache-first"];
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const stable = (value) =>
  JSON.stringify(value, (_, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, v[k]]),
        )
      : v,
  );
const equal = (a, b) => stable(a) === stable(b);
export const digest = async (bytes) =>
  [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
export function inventory(data, present = true) {
  if (!present) return { kind: "absent" };
  check(data && Array.isArray(data.products), "Expected product data");
  const matches = data.products.filter((p) => p.sku === "demo-lamp");
  check(matches.length === 1, "Expected one lamp");
  const availability = matches[0].availability;
  if (availability === null) return { kind: "null" };
  check(
    availability && Number.isInteger(availability.quantity),
    "Expected inventory",
  );
  return { kind: "quantity", quantity: availability.quantity };
}
// A bounded consistency check for this fixed recording, not a general Apollo validator.
export async function projectRecording(raw, pin = PIN) {
  raw = structuredClone(raw);
  check(raw.kind === pin.kind && raw.sourceStable === true, "Wrong recording");
  check(raw.browser.sessionId === raw.sessionId, "Session mismatch");
  check(
    equal(raw.sourceBefore, raw.sourceAfter) &&
      raw.sourceBefore.git.dirty === false &&
      raw.sourceBefore.git.head === pin.revision,
    "Source mismatch",
  );
  check(
    (await digest(
      new TextEncoder().encode(JSON.stringify(raw.sourceBefore.manifest)),
    )) === raw.sourceBefore.sha256,
    "Source manifest mismatch",
  );
  check(
    raw.harnessStable === true && equal(raw.harnessBefore, raw.harnessAfter),
    "Harness changed",
  );
  check(
    raw.tooling.packages["@apollo/client"] === "4.3.3" &&
      raw.tooling.packages.react === "19.3.1" &&
      raw.tooling.packages["react-dom"] === "19.3.1",
    "Version mismatch",
  );
  check(
    raw.browser.configuration.strictMode === false &&
      raw.browser.configuration.mode === "production",
    "Configuration mismatch",
  );
  check(
    Array.isArray(raw.browser.faults) && raw.browser.faults.length === 0,
    "Captured runtime faults",
  );
  check(
    raw.browser.cases.length === 2 &&
      new Set(raw.browser.cases.map((c) => c.errorPolicy)).size === 2 &&
      new Set(raw.browser.cases.map((c) => c.caseId)).size === 2,
    "Policy cases mismatch",
  );
  check(raw.serverObservedRequests.length === 4, "Request total mismatch");
  const cases = {};
  for (const c of raw.browser.cases) {
    check(["all", "none"].includes(c.errorPolicy), "Unexpected policy");
    check(
      c.cleanup.rootUnmounted && c.cleanup.clientStopped,
      "Incomplete cleanup",
    );
    check(
      equal(
        c.steps.map((s) => s.label),
        phases,
      ) &&
        equal(
          c.steps.map((s) => s.requestCount),
          [1, 1, 0],
        ),
      "Step requests mismatch",
    );
    const server = raw.serverObservedRequests.filter(
      (r) => r.caseId === c.caseId,
    );
    check(
      c.requests.length === 2 && server.length === 2,
      "Request count mismatch",
    );
    for (let i = 0; i < 2; i++) {
      const a = c.requests[i],
        b = server[i];
      check(
        a.transportError === null && b.transportError === undefined,
        "Transport error",
      );
      check(
        a.phase === phases[i] &&
          b.phase === a.phase &&
          a.endpoint === (i ? "failure" : "healthy") &&
          b.endpoint === a.endpoint,
        "Request route mismatch",
      );
      check(
        a.requestBodyText === b.requestBodyText &&
          a.response.bodyText === b.response.bodyText &&
          a.response.status === 200 &&
          b.response.status === 200,
        "HTTP mismatch",
      );
      check(
        (await digest(new TextEncoder().encode(a.response.bodyText))) ===
          a.response.sha256 && a.response.sha256 === b.response.sha256,
        "HTTP hash mismatch",
      );
    }
    const healthy = JSON.parse(c.requests[0].response.bodyText),
      failed = JSON.parse(c.requests[1].response.bodyText);
    check(
      !healthy.errors &&
        inventory(healthy.data).quantity === 3 &&
        inventory(failed.data).kind === "null",
      "Unexpected response inventory",
    );
    check(
      equal(
        failed.errors.map((e) => e.path),
        [["products", 1, "availability"]],
      ),
      "Error path mismatch",
    );
    const expected = c.errorPolicy === "all" ? failed.data : healthy.data;
    const [warm, failure, cache] = c.steps;
    check(
      equal(warm.after.latestHook.data, healthy.data),
      "Warm data mismatch",
    );
    check(
      equal(failure.after.latestHook.data, expected) &&
        equal(failure.after.latestHook.error?.data, failed.data),
      "Failure data mismatch",
    );
    check(
      failure.after.latestHook.networkStatus === 8 &&
        failure.after.latestHook.dataState === "complete",
      "Failure status mismatch",
    );
    check(
      failure.settlement.status ===
        (c.errorPolicy === "all" ? "resolved" : "rejected"),
      "Promise mismatch",
    );
    check(
      equal(
        (failure.settlement.result?.error ?? failure.settlement.error)?.data,
        failed.data,
      ),
      "Promise error data mismatch",
    );
    check(
      equal(cache.after.latestHook.data, expected) &&
        cache.after.latestHook.error === null &&
        cache.after.latestHook.networkStatus === 7,
      "Cache result mismatch",
    );
    check(
      cache.settlement.status === "resolved" &&
        equal(cache.settlement.result.data, expected) &&
        equal(cache.before.cache, cache.after.cache) &&
        equal(cache.after.readQuery, expected),
      "Cache contents mismatch",
    );
    const steps = c.steps.map((step) => {
      const hook = step.after.latestHook;
      const observations = c.domObservations.filter(
        (o) => o.phase === step.label,
      );
      check(
        observations.length > 0 && equal(observations.at(-1).result, hook),
        "DOM result mismatch",
      );
      const dom = observations.at(-1);
      check(
        dom.kind === "post-commit-dom-read" &&
          dom.dom.textContent.endsWith(JSON.stringify(hook, null, 2)),
        "DOM text mismatch",
      );
      const escape = (text) =>
        text
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
      const cards = [
        ...dom.dom.html.matchAll(
          /<article class="card"><h3>([^<]*)<\/h3><strong>([^<]*)<\/strong><span class="status">([^<]*)<\/span><\/article>/g,
        ),
      ].map((m) => m.slice(1));
      check(
        equal(
          cards,
          hook.data.products.map((p) => [
            escape(p.name),
            p.availability === null
              ? "확인 불가"
              : String(p.availability.quantity),
            p.availability?.status ?? "nullable availability = null",
          ]),
        ),
        "Visible DOM cards mismatch",
      );
      const errors = [
        ...dom.dom.html.matchAll(/<p class="error">([^<]*)<\/p>/g),
      ].map((m) => m[1]);
      check(
        equal(
          errors,
          hook.error ? [escape("이번 조회 오류: " + hook.error.message)] : [],
        ),
        "Visible DOM error mismatch",
      );
      const lampText = (data) =>
        data === null
          ? "데이터 없음"
          : data.products.find((p) => p.sku === "demo-lamp").availability ===
              null
            ? "null · 확인 불가"
            : String(
                data.products.find((p) => p.sku === "demo-lamp").availability
                  .quantity,
              );
      const definitions = [
        ...dom.dom.html.matchAll(/<dt>([^<]*)<\/dt><dd>([^<]*)<\/dd>/g),
      ].map((m) => m.slice(1));
      check(
        equal(definitions, [
          [
            "networkStatus",
            `${hook.networkStatus} · ${hook.networkStatusName}`,
          ],
          ["loading / dataState", `${hook.loading} / ${hook.dataState}`],
          ["data의 조명 재고", lampText(hook.data)],
          ["previousData 재고", lampText(hook.previousData)],
          [
            "error.data 재고",
            hook.error ? lampText(hook.error.data) : "오류 없음",
          ],
        ]),
        "Visible DOM definitions mismatch",
      );
      check(
        hook.dataPresent === true && hook.loading === false,
        "Terminal hook mismatch",
      );
      check(
        typeof hook.previousDataPresent === "boolean" &&
          (hook.previousDataPresent || hook.previousData === null),
        "Hidden previous value",
      );
      if (step.label === "failed") {
        check(
          hook.previousDataPresent === (c.errorPolicy === "all"),
          "Previous data presence mismatch",
        );
        if (hook.previousDataPresent)
          check(
            equal(hook.previousData, healthy.data),
            "Previous data mismatch",
          );
      }
      return {
        label: step.label,
        data: inventory(hook.data, hook.dataPresent),
        previous: inventory(hook.previousData, hook.previousDataPresent),
        errorData: hook.error
          ? inventory(hook.error.data, hook.error.dataPresent)
          : { kind: "no-error" },
        hasError: Boolean(hook.error),
        networkStatus: hook.networkStatus,
        dataState: hook.dataState,
        promise: step.settlement?.status ?? "initial",
        http: step.requestCount,
        raw: { step, terminalDOM: dom },
      };
    });
    cases[c.errorPolicy] = { steps, raw: c };
  }
  return {
    cases,
    generatedAt: raw.generatedAt,
    tooling: raw.tooling,
    source: raw.sourceBefore,
    configuration: raw.browser.configuration,
  };
}
export async function readRecording(bytes, pin = PIN) {
  check(
    pin.status === "published" && /^[a-f0-9]{64}$/.test(pin.sha256),
    "No reviewed pin",
  );
  check(
    bytes.length < 2_000_000 && (await digest(bytes)) === pin.sha256,
    "Recording bytes mismatch",
  );
  return projectRecording(
    JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
    pin,
  );
}
export function readState(search) {
  const p = new URLSearchParams(search);
  return {
    policy: p.get("policy") === "all" ? "all" : "none",
    step: phases.includes(p.get("step")) ? p.get("step") : "failed",
    details: detailIds.filter((id) => p.get("open")?.split(",").includes(id)),
  };
}
export function stateSearch(state, lang) {
  const p = new URLSearchParams({
    lang,
    policy: state.policy,
    step: state.step,
  });
  if (state.details.length) p.set("open", state.details.join(","));
  return "?" + p;
}
