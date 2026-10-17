// This validates a fixed historical presentation, not arbitrary experiment runs.
export const PIN = Object.freeze({
  revision: "c60801f969ab0223812bb4fa609c2de3e7651c91",
  runId: "retention-2026-10-16T18-29-07-589Z-a96f9a01",
  completedAt: "2026-10-16T18:29:09.869Z",
  rawSha256: "c700118d900858be573d6924be16ae96ffe95369a57a9aa01aed0f1c83dd8fdd",
  sourceSha256:
    "85b53a5ca373354fcf3bb492dae1e03bc5236feff412d6b531f4a38919c8c803",
});

const require = (condition, message) => {
  if (!condition) throw new Error(message);
};
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const number = (n) => Number.isSafeInteger(n) && n >= 0;
const caseNames = [
  "retained-positive",
  "naive-expired",
  "guarded-postcommit",
  "guarded-precommit",
  "guarded-delayed-arrival",
];
const selectionSpecs = [];
for (const [prefix, index] of [
  ["zero", 3],
  ["one", 2],
]) {
  for (const [suffix, tail, visibility] of [
    ["local-tables", "audit/localJournal", "policy"],
    ["unknown", "audit/localJournal/2", "policy"],
    ["absent", "audit/localJournal/4", "policy"],
    ["refused", "audit/localJournal/5", "policy"],
    ["remote-history", "audit/remoteJournal", "auditor"],
    ["remote-effects", "audit/effects", "auditor"],
  ])
    selectionSpecs.push({
      id: `${prefix}-${suffix}`,
      pointer: `/cases/${index}/${tail}`,
      visibility,
    });
}
for (const [suffix, tail, visibility] of [
  ["initial-effect", "audit/remoteJournal/0", "auditor"],
  ["retry", "audit/localJournal/3", "policy"],
  ["held", "observations/10", "harness"],
  ["local-clock", "observations/11", "harness"],
  ["remote-clock", "observations/12", "harness"],
  ["prune-ack", "observations/13", "harness"],
  ["prune-record", "audit/remoteJournal/1", "auditor"],
  ["forwarded", "observations/14", "harness"],
  ["second-effect", "audit/remoteJournal/2", "auditor"],
  ["local-grant", "audit/localJournal/4", "policy"],
  ["final-response", "observations/15", "client"],
])
  selectionSpecs.push({
    id: `late-${suffix}`,
    pointer: `/cases/4/${tail}`,
    visibility,
  });

export function atPointer(value, pointer) {
  require(typeof pointer === "string" &&
    pointer.startsWith("/"), "Invalid JSON pointer");
  return pointer
    .slice(1)
    .split("/")
    .reduce((current, escaped) => {
      const key = escaped.replaceAll("~1", "/").replaceAll("~0", "~");
      require(current !== null &&
        typeof current === "object" &&
        Object.hasOwn(current, key), "Missing JSON pointer");
      return current[key];
    }, value);
}

function ordered(stream, field) {
  require(Array.isArray(stream) && stream.length > 0, "Missing ordered stream");
  stream.forEach((event, i) =>
    require(event[field] ===
      i + 1, "Stream sequence disagrees with array order"),
  );
}

// Deliberately independent of summary booleans: this checks the two displayed contrasts.
// It does not replace the source auditor or prove execution authenticity.
export function analyzeEvidence(report, mapping) {
  require(report?.schemaVersion === 1 &&
    report.runId === PIN.runId &&
    report.completedAt === PIN.completedAt, "Capture identity mismatch");
  require(equal(
    report.cases?.map((c) => c.scenario),
    caseNames,
  ), "Scenario inventory mismatch");
  require(report.sourceStable === true &&
    equal(
      report.sourceBefore,
      report.sourceAfter,
    ), "Source stability mismatch");
  require(report.sourceBefore.sha256 === PIN.sourceSha256 &&
    report.sourceBefore.git.head === PIN.revision &&
    report.sourceBefore.git.dirty === false, "Historical source mismatch");
  require(report.passed === true &&
    report.expectedResultsEstablished ===
      true, "Capture did not establish its expected results");
  require(report.fixture.ttl === 1000 &&
    report.fixture.conservativeMargin === 100 &&
    report.fixture.clockTrust ===
      "parent-controlled equal-rate zero-offset fixture", "Fixture clock contract mismatch");
  require(mapping?.capture?.sha256 === PIN.rawSha256 &&
    mapping.capture.sourceRevision === PIN.revision &&
    mapping.capture.sourceFingerprint ===
      PIN.sourceSha256, "Mapping capture mismatch");
  require(mapping.selections?.length ===
    selectionSpecs.length, "Selector inventory mismatch");
  const selected = new Map();
  for (const spec of selectionSpecs) {
    const entries = mapping.selections.filter((s) => s.id === spec.id);
    require(entries.length === 1, "Duplicate or missing selector");
    const entry = entries[0];
    require(entry.pointer === spec.pointer &&
      entry.visibility ===
        spec.visibility, "Selector access or pointer mismatch");
    const actual = atPointer(report, spec.pointer);
    require(equal(
      actual,
      entry.expected,
    ), `Selected value mismatch: ${spec.id}`);
    require(typeof entry.label?.en === "string" &&
      typeof entry.label?.ko === "string", "Missing translated record label");
    selected.set(spec.id, { ...entry, actual });
  }
  const zero = report.cases[3];
  const one = report.cases[2];
  const late = report.cases[4];
  for (const c of [zero, one, late]) {
    require(c.audit.scenario === c.scenario &&
      c.audit.expectedResultEstablished === true, "Scenario audit mismatch");
    ordered(c.audit.localJournal, "seq");
    ordered(c.audit.remoteJournal, "seq");
    ordered(c.observations, "sequence");
    require(c.audit.intents.length === 1 &&
      c.audit.intents[0].id === "intent-same-business" &&
      c.audit.intents[0].intent_key === "key-intent-same-business" &&
      c.audit.intents[0].units === 1, "Intent identity mismatch");
    const intent = c.audit.intents[0];
    require(intent.first_at === 10000 &&
      intent.retry_before === 10900 &&
      intent.retry_before ===
        intent.first_at +
          report.fixture.ttl -
          report.fixture.conservativeMargin, "Stored cutoff mismatch");
    require(c.audit.checks.remoteEffects === c.audit.effects.length &&
      c.audit.checks.localGrants ===
        c.audit.grants.length, "Summary metrics disagree with durable rows");
  }
  const tableKeys = ["intents", "grants", "localJournal", "localClockFloor"];
  require(tableKeys.every((key) =>
    equal(zero.audit[key], one.audit[key]),
  ), "Local tables are not identical");
  const responses = (c) =>
    c.observations
      .filter((e) => e.type === "local-http-response")
      .map(({ status, body }) => ({ status, body }));
  require(responses(zero).length === 5 &&
    equal(
      responses(zero),
      responses(one),
    ), "Local HTTP responses are not identical");
  for (const c of [zero, one]) {
    require(c.audit.intents[0].status === "needs-reconciliation" &&
      c.audit.intents[0].receipt === null &&
      c.audit.grants.length === 0, "Unresolved state mismatch");
    require(c.audit.localJournal.filter((e) => e.event === "dispatch-post")
      .length === 1, "Guarded execution was silently replayed");
  }
  require(zero.audit.effects.length === 0 &&
    one.audit.effects.length === 1, "Zero/one contrast not established");
  const equality = report.localObservationsIndistinguishable;
  require(equality.equal === true &&
    equality.httpResponsesEqual === true &&
    equality.allLocalTablesEqual === true &&
    equality.durableLocalJournalsEqual === true &&
    equal(equality.remoteEffectCounts, [0, 1]), "Equality summary mismatch");

  const event = (id) => selected.get(id).actual;
  const initial = event("late-initial-effect");
  const retry = event("late-retry");
  const second = event("late-second-effect");
  const grant = event("late-local-grant");
  const prune = event("late-prune-record");
  const final = event("late-final-response");
  require(initial.event === "post-new-effect" &&
    initial.detail.attemptId === "attempt-1" &&
    retry.event === "dispatch-post" &&
    second.event === "post-new-effect" &&
    grant.event === "local-grant", "Attempt event mismatch");
  const correlated = [
    "late-retry",
    "late-held",
    "late-forwarded",
    "late-second-effect",
    "late-local-grant",
  ];
  require(correlated.every(
    (id) =>
      (event(id).detail?.attemptId ?? event(id).attemptId) === "attempt-2",
  ), "Attempt correlation mismatch");
  require(initial.detail.receipt !== second.detail.receipt &&
    grant.detail.receipt === second.detail.receipt &&
    final.body.receipt === second.detail.receipt &&
    final.status === 200 &&
    final.body.status ===
      "confirmed", "New receipt is not bound to the exact retry");
  require(late.audit.effects.length === 2 &&
    late.audit.grants.length === 1 &&
    late.audit.grants[0].receipt === second.detail.receipt &&
    late.audit.intents[0].receipt ===
      second.detail.receipt, "Final durable receipt mismatch");
  require(equal(
    late.audit.effects.map((e) => e.receipt),
    [initial.detail.receipt, second.detail.receipt],
  ) &&
    equal(
      late.audit.effects.map((e) => e.created_at),
      [initial.clock, second.clock],
    ), "Effect rows disagree with journal");
  require(number(retry.clock) &&
    retry.clock === 10020 &&
    retry.clock < retry.detail.retryBefore &&
    retry.detail.retryBefore ===
      late.audit.intents[0].retry_before, "Dispatch was not eligible");
  const expiry = initial.clock + report.fixture.ttl;
  require(initial.clock === 10000 &&
    expiry === 11000 &&
    prune.event === "dedup-pruned" &&
    prune.clock >= expiry &&
    prune.clock === 12000 &&
    second.clock === prune.clock &&
    grant.clock === second.clock, "Expiry or arrival threshold mismatch");
  require(initial.seq < prune.seq &&
    prune.seq < second.seq, "Remote commit/prune order mismatch");
  const parentIds = [
    "late-held",
    "late-local-clock",
    "late-remote-clock",
    "late-prune-ack",
    "late-forwarded",
    "late-final-response",
  ];
  const parent = parentIds.map(event);
  require(parent.every(
    (e, i) => i === 0 || e.sequence > parent[i - 1].sequence,
  ), "Parent hold/prune/forward order mismatch");
  require(parent[0].type === "relay-held" &&
    parent[4].type === "relay-forwarded" &&
    parent[1].role === "local" &&
    parent[2].role === "downstream" &&
    parent[1].control === "clock" &&
    parent[2].control === "clock" &&
    parent[1].value === 12000 &&
    parent[2].value === 12000 &&
    parent[3].role === "downstream" &&
    parent[3].control === "prune", "Parent control semantics mismatch");
  require(late.audit.checks.remoteEffectAtMostOnce === false &&
    late.audit.checks.expectedLimitation === true &&
    late.audit.checks.locallyEligibleRetryArrivedAfterPruning ===
      true, "Late arrival is not marked as a uniqueness limitation");
  require(mapping.panels?.length === 2, "Panel inventory mismatch");
  const [samePanel, latePanel] = mapping.panels;
  require(samePanel.id === "indistinguishable" &&
    samePanel.equality.result === true &&
    samePanel.equality.normalization === "none" &&
    equal(
      samePanel.equality.tableKeys,
      tableKeys,
    ), "Presentation equality claim mismatch");
  require(equal(samePanel.metrics, [
    { case: "zero", remoteEffects: zero.audit.effects.length, localGrants: 0 },
    { case: "one", remoteEffects: one.audit.effects.length, localGrants: 0 },
  ]), "Presentation metrics mismatch");
  require(latePanel.id === "late-arrival" &&
    equal(latePanel.metrics, {
      remoteEffects: late.audit.effects.length,
      localGrants: late.audit.grants.length,
      remoteEffectAtMostOnce: false,
      expectedLimitationEstablished: true,
    }), "Presentation late metrics mismatch");
  require(equal(latePanel.parentOrderedSelections, parentIds) &&
    latePanel.correlation.attemptId === "attempt-2" &&
    equal(
      latePanel.correlation.selectionIds,
      correlated,
    ), "Presentation causal order mismatch");
  require(latePanel.thresholds[0].value ===
    late.audit.intents[0].retry_before &&
    atPointer(report, latePanel.thresholds[0].pointer) === 10900 &&
    latePanel.thresholds[1].value === expiry &&
    equal(latePanel.thresholds[1].derive.pointers, [
      "/cases/4/audit/effects/0/created_at",
      "/fixture/ttl",
    ]), "Presentation thresholds mismatch");
  return {
    selected,
    metrics: {
      zero: zero.audit.effects.length,
      one: one.audit.effects.length,
      remote: late.audit.effects.length,
      local: late.audit.grants.length,
    },
    clocks: {
      dispatch: retry.clock,
      cutoff: late.audit.intents[0].retry_before,
      minimum: expiry,
      arrival: second.clock,
    },
  };
}

export async function sha256(bytes) {
  const data =
    typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes;
  return [
    ...new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", data)),
  ]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}

export async function validateBundle(rawBytes, mappingBytes, manifest) {
  require((await sha256(rawBytes)) ===
    PIN.rawSha256, "Raw recording hash mismatch");
  require(manifest?.kind === "historical-retention-note" &&
    manifest.sourceRevision === PIN.revision &&
    manifest.rawSha256 === PIN.rawSha256 &&
    manifest.sourceFingerprint ===
      PIN.sourceSha256, "Bundle identity mismatch");
  require((await sha256(mappingBytes)) ===
    manifest.mappingSha256, "Mapping hash mismatch");
  const decode = (bytes) =>
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const report = JSON.parse(decode(rawBytes));
  const mapping = JSON.parse(decode(mappingBytes));
  require((await sha256(JSON.stringify(report.sourceBefore.files))) ===
    PIN.sourceSha256 &&
    (await sha256(JSON.stringify(report.sourceAfter.files))) ===
      PIN.sourceSha256, "Source manifest digest mismatch");
  return { report, mapping, ...analyzeEvidence(report, mapping) };
}
