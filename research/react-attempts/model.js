import { PIN } from "./pin.js";
export const caseIds = [
  "late-success",
  "product-switch",
  "variable-switch",
  "aba",
  "cache-read",
];
export const detailIds = ["case-detail", "provenance-detail"];
const modes = ["status-only", "guarded-write"];
const scopes = {
  a: { sku: "demo-a", warehouse: "east" },
  b: { sku: "demo-b", warehouse: "east" },
  west: { sku: "demo-a", warehouse: "west" },
};
const check = (yes, message) => {
  if (!yes) throw new Error(message);
};
const stable = (v) =>
  JSON.stringify(v, (_, x) =>
    x && typeof x === "object" && !Array.isArray(x)
      ? Object.fromEntries(
          Object.keys(x)
            .sort()
            .map((k) => [k, x[k]]),
        )
      : x,
  );
const equal = (a, b) => stable(a) === stable(b);
export const digest = async (bytes) =>
  [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
const bytes = (text) => new TextEncoder().encode(text);
const quantity = (data) =>
  data?.product === null ? null : data?.product?.quantity;
function cacheValue(cache, scope) {
  const matches = Object.values(cache).filter(
    (v) =>
      v?.__typename === "Product" &&
      v.sku === scope.sku &&
      v.warehouse === scope.warehouse,
  );
  check(matches.length <= 1, "Duplicate normalized entity");
  return matches[0]?.quantity;
}
function expectedSlot(scenario, slot) {
  if (slot === "seed") return { scope: scopes.a, quantity: 3 };
  if (slot === "old" && scenario !== "cache-read")
    return { scope: scopes.a, quantity: 7 };
  check(slot === "new", "Unexpected slot");
  if (scenario === "late-success" || scenario === "cache-read")
    return { scope: scopes.a, failed: true };
  return {
    scope:
      scenario === "product-switch"
        ? scopes.b
        : scenario === "variable-switch"
          ? scopes.west
          : scopes.a,
    quantity: scenario === "aba" ? 9 : 12,
  };
}
function checkDOM(step, observations) {
  const definitions = [
    ...step.dom.html.matchAll(/<dt>([^<]*)<\/dt><dd>([^<]*)<\/dd>/g),
  ].map((m) => m.slice(1));
  check(
    equal(definitions, [
      ["scope", `${step.scope.sku} / ${step.scope.warehouse}`],
      ["epoch", String(step.epoch)],
      ["quantity", String(quantity(step.hook.data) ?? "unavailable")],
      ["attempt", step.attempt.status],
      ["hook error", step.hook.error?.message ?? "none"],
    ]),
    "DOM values mismatch",
  );
  const match = observations.find(
    (o) =>
      equal(o.dom, step.dom) &&
      equal(o.hook, step.hook) &&
      equal(o.state.scope, step.scope) &&
      o.state.epoch === step.epoch &&
      equal(o.state.attempt, step.attempt),
  );
  check(match, "Missing actual DOM observation");
  const json = JSON.stringify({ state: match.state, hook: step.hook }, null, 2);
  const escape = (text) =>
    text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  check(
    step.dom.textContent.endsWith(json) &&
      step.dom.html.includes("<pre>" + escape(json) + "</pre>"),
    "DOM hook JSON mismatch",
  );
}
// Checks this bounded recording format. It does not prove production concurrency safety.
export async function projectRecording(input, pin = PIN) {
  const raw = structuredClone(input);
  check(
    raw.kind === pin.kind &&
      raw.schema === 1 &&
      raw.browser.kind === "react-attempts-observation",
    "Recording kind mismatch",
  );
  check(raw.browser.sessionId === raw.sessionId, "Session mismatch");
  check(
    raw.sourceStable === true &&
      equal(raw.sourceBefore, raw.sourceAfter) &&
      raw.sourceBefore.git.dirty === false &&
      raw.sourceBefore.git.head === pin.revision,
    "Source mismatch",
  );
  check(
    (await digest(bytes(JSON.stringify(raw.sourceBefore.manifest)))) ===
      raw.sourceBefore.sha256,
    "Manifest mismatch",
  );
  check(
    raw.harnessStable === true && equal(raw.harnessBefore, raw.harnessAfter),
    "Harness mismatch",
  );
  check(
    raw.tooling.react === "19.3.1" && raw.tooling.apollo === "4.3.3",
    "Version mismatch",
  );
  check(
    raw.browser.configuration.mode === "production" &&
      raw.browser.configuration.strictMode === false &&
      raw.browser.configuration.queryDeduplication === false &&
      raw.browser.configuration.observerPolicy === "cache-only",
    "Configuration mismatch",
  );
  check(
    Array.isArray(raw.browser.faults) && raw.browser.faults.length === 0,
    "Runtime faults",
  );
  check(
    raw.browser.cases.length === 10 &&
      new Set(raw.browser.cases.map((c) => c.caseId)).size === 10,
    "Case count mismatch",
  );
  check(
    raw.serverObservedRequests.length === 28 && raw.releases.length === 28,
    "HTTP total mismatch",
  );
  const result = {
    cases: {},
    source: raw.sourceBefore,
    generatedAt: raw.generatedAt,
    tooling: raw.tooling,
    configuration: raw.browser.configuration,
  };
  for (const scenario of caseIds) {
    const pair = { raw: {}, releases: [] };
    for (const mode of modes) {
      const matches = raw.browser.cases.filter(
        (c) => c.scenario === scenario && c.mode === mode,
      );
      check(matches.length === 1, "Missing implementation");
      const c = matches[0],
        expectedOrder =
          scenario === "cache-read" ? ["seed", "new"] : ["seed", "new", "old"];
      check(
        c.caseId === `${scenario}-${mode}` &&
          equal(c.releaseOrder, expectedOrder),
        "Release order mismatch",
      );
      check(
        c.events.every((event, index) => event.sequence === index + 1),
        "Event sequence mismatch",
      );
      check(
        equal(
          c.events
            .filter((e) => e.type === "release-request")
            .map((e) => e.slot),
          expectedOrder,
        ),
        "Release events mismatch",
      );
      for (const slot of expectedOrder) {
        const stages = [
          "attempt-start",
          "request-start",
          "release-request",
          "response-read",
          "decision",
        ].map((type) => {
          const matches = c.events.filter(
            (e) => e.slot === slot && e.type === type,
          );
          check(matches.length === 1, "Missing causal event");
          return matches[0].sequence;
        });
        check(
          stages.every((n, i) => i === 0 || n > stages[i - 1]),
          "Response causal order mismatch",
        );
      }
      const releases = raw.releases.filter((r) => r.caseId === c.caseId);
      check(
        equal(
          releases.map((r) => r.slot),
          expectedOrder,
        ),
        "Server release mismatch",
      );
      check(
        c.requests.length === expectedOrder.length &&
          new Set(c.requests.map((r) => r.slot)).size === expectedOrder.length,
        "Request slots mismatch",
      );
      const server = raw.serverObservedRequests.filter(
        (r) => r.caseId === c.caseId,
      );
      check(server.length === c.requests.length, "Server requests mismatch");
      for (const request of c.requests) {
        const s = server.find((s) => s.slot === request.slot),
          spec = expectedSlot(scenario, request.slot);
        check(
          s &&
            s.requestBodyText === request.requestBodyText &&
            s.response.status === 200 &&
            request.response.status === 200 &&
            s.response.bodyText === request.response.bodyText,
          "HTTP body mismatch",
        );
        check(
          request.requestWireText === s.requestWireText &&
            request.requestWireSha256 === s.requestWireSha256 &&
            (await digest(bytes(request.requestWireText))) ===
              request.requestWireSha256,
          "Request wire mismatch",
        );
        const wire = JSON.parse(request.requestWireText);
        check(
          wire.caseId === c.caseId &&
            wire.slot === request.slot &&
            equal(wire.operation, JSON.parse(request.requestBodyText)),
          "Request wire interpretation mismatch",
        );
        check(
          (await digest(bytes(request.response.bodyText))) ===
            request.response.sha256 &&
            s.response.sha256 === request.response.sha256,
          "HTTP hash mismatch",
        );
        const operation = JSON.parse(request.requestBodyText),
          response = JSON.parse(request.response.bodyText);
        check(equal(operation.variables, spec.scope), "Query scope mismatch");
        if (spec.failed)
          check(
            response.data.product === null && response.errors.length === 1,
            "Failure response mismatch",
          );
        else
          check(
            !response.errors &&
              equal(response.data.product, {
                ...spec.scope,
                quantity: spec.quantity,
                __typename: "Product",
              }),
            "Successful response mismatch",
          );
      }
      check(
        c.cleanup.rootUnmounted === true && c.cleanup.clientStopped === true,
        "Cleanup mismatch",
      );
      check(Array.isArray(c.steps) && c.steps.length >= 4, "Missing steps");
      const labels =
        scenario === "cache-read"
          ? ["seed-success", "new-pending", "new-failed", "cache-only-read"]
          : [
              "seed-success",
              "old-pending",
              ...(scenario === "aba"
                ? ["scope-b", "scope-a-again"]
                : ["product-switch", "variable-switch"].includes(scenario)
                  ? ["scope-changed"]
                  : []),
              "new-pending",
              "new-settled",
              "old-settled",
            ];
      check(
        equal(
          c.steps.map((s) => s.label),
          labels,
        ),
        "Snapshot order mismatch",
      );
      check(
        equal(
          c.events.filter((e) => e.type === "snapshot").map((e) => e.label),
          labels,
        ),
        "Snapshot events mismatch",
      );
      for (const step of c.steps) {
        checkDOM(step, c.domObservations);
        check(
          step.hook.error === null && step.hook.loading === false,
          "Unexpected observer state",
        );
        if (step.hook.data?.product) {
          check(
            equal(
              {
                sku: step.hook.data.product.sku,
                warehouse: step.hook.data.product.warehouse,
              },
              step.scope,
            ),
            "Visible scope mismatch",
          );
          check(
            quantity(step.hook.data) === cacheValue(step.cache, step.scope),
            "Visible cache mismatch",
          );
        }
      }
      const final = c.steps.at(-1),
        newer = c.decisions.find((d) => d.token.slot === "new");
      check(newer && newer.accepted === true, "New attempt not accepted");
      check(
        c.decisions.length === expectedOrder.length &&
          equal(
            c.decisions.map((d) => d.token.slot),
            expectedOrder,
          ),
        "Decision order mismatch",
      );
      check(
        final.attempt.id === newer.token.id &&
          final.attempt.status === newer.outcome,
        "Latest attempt mismatch",
      );
      for (const d of c.decisions) {
        const spec = expectedSlot(scenario, d.token.slot);
        check(
          equal(d.token.scope, spec.scope) &&
            d.outcome === (spec.failed ? "failed" : "succeeded") &&
            d.promise.status === d.outcome,
          "Decision outcome mismatch",
        );
        check(
          d.accepted === (d.token.slot !== "old"),
          "Old response acceptance mismatch",
        );
        check(
          d.cacheWrite ===
            (mode === "guarded-write" &&
              d.accepted &&
              d.outcome === "succeeded"),
          "Explicit write decision mismatch",
        );
      }
      if (scenario === "cache-read") {
        check(
          final.label === "cache-only-read" &&
            c.cacheOnlyRead.error === null &&
            equal(c.cacheOnlyRead.data, final.hook.data),
          "Cache-only read mismatch",
        );
        check(
          final.attempt.status === "failed" && quantity(final.hook.data) === 3,
          "Failure preservation mismatch",
        );
      }
      const lastObservation = c.domObservations.at(-1);
      check(
        lastObservation &&
          equal(lastObservation.hook, final.hook) &&
          equal(lastObservation.dom, final.dom) &&
          equal(lastObservation.state.scope, final.scope) &&
          equal(lastObservation.state.attempt, final.attempt),
        "Terminal observation mismatch",
      );
      const projected = {
        display: quantity(final.hook.data),
        before: quantity(c.steps.at(-2).hook.data),
        scope: final.scope,
        attempt: final.attempt,
        cache: {
          a: cacheValue(final.cache, scopes.a),
          b: cacheValue(final.cache, scopes.b),
          west: cacheValue(final.cache, scopes.west),
        },
        http: c.requests.length,
        decisions: c.decisions,
        raw: c,
      };
      // Fixed outcomes checked against the reviewed 2026-10-18 browser capture.
      // Updating a capture requires reviewing its explanatory copy as well.
      const guarded = mode === "guarded-write";
      const expectedDisplay =
        scenario === "late-success"
          ? guarded
            ? 3
            : 7
          : scenario === "aba"
            ? guarded
              ? 9
              : 7
            : scenario === "cache-read"
              ? 3
              : 12;
      const expectedA =
        scenario === "aba"
          ? guarded
            ? 9
            : 7
          : scenario === "cache-read"
            ? 3
            : guarded
              ? 3
              : 7;
      check(
        projected.display === expectedDisplay &&
          projected.cache.a === expectedA,
        "Published outcome mismatch",
      );
      if (scenario === "product-switch")
        check(
          projected.cache.b === 12 && projected.cache.west === undefined,
          "Product isolation mismatch",
        );
      if (scenario === "variable-switch")
        check(
          projected.cache.west === 12 && projected.cache.b === undefined,
          "Variable isolation mismatch",
        );
      pair[mode === "status-only" ? "baseline" : "managed"] = projected;
      pair.raw[mode] = c;
      if (!pair.releases.length)
        pair.releases = expectedOrder.map((slot) => ({
          slot,
          ...expectedSlot(scenario, slot),
        }));
    }
    result.cases[scenario] = pair;
  }
  return result;
}
export async function readRecording(data, pin = PIN) {
  check(
    pin.status === "published" && /^[a-f0-9]{64}$/.test(pin.sha256),
    "No reviewed pin",
  );
  check(
    data.length < 5_000_000 && (await digest(data)) === pin.sha256,
    "Recording bytes mismatch",
  );
  return projectRecording(
    JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(data)),
    pin,
  );
}
export function readState(search) {
  const p = new URLSearchParams(search);
  return {
    id: caseIds.includes(p.get("case")) ? p.get("case") : "late-success",
    details: detailIds.filter((id) => p.get("open")?.split(",").includes(id)),
  };
}
export function stateSearch(state, language) {
  const p = new URLSearchParams({ lang: language, case: state.id });
  if (state.details.length) p.set("open", state.details.join(","));
  return "?" + p;
}
