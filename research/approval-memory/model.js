export const PIN = Object.freeze({
  // Prose evolves separately from the preserved capture.
  docsRevision: "a3dd1daec9bb79f3bd5564c1968501e1cac8e744",
  revision: "23731a14e6ee4fc1fe2ff739b839cca849cbb4cb",
  sha256: "8c2eabb549d48e5b62356f25c61246f7d93452152057c16d256c363617944fb7",
  source: "b9d2411b741fc4995b80db18cf12748c797d541aa43811e9b34c751e7e3ea83e",
});
export const stops = ["separate", "prepared", "selected"];
export const rollbacks = ["preserve", "rewind"];
export const detailIds = [
  "stop-raw",
  "rollback-raw",
  "reader-raw",
  "provenance-raw",
];
const ids = [
  "separate-write-gap",
  "state-prepared-before-cas",
  "state-cas-before-ack",
  "value-rollback-versus-state-rewind",
  "reader-capture-contract",
];

export function readState(search = "") {
  const p = new URLSearchParams(search);
  return {
    stop: stops.includes(p.get("stop")) ? p.get("stop") : stops[0],
    rollback: rollbacks.includes(p.get("rollback"))
      ? p.get("rollback")
      : rollbacks[0],
    details: (p.get("details") || "")
      .split(",")
      .filter((id, i, all) => detailIds.includes(id) && all.indexOf(id) === i),
  };
}

export function stateSearch(state, language) {
  const p = new URLSearchParams({
    lang: language === "ko" ? "ko" : "en",
    stop: state.stop,
    rollback: state.rollback,
  });
  if (state.details.length) p.set("details", state.details.join(","));
  return `?${p}`;
}

export async function readRecording(bytes) {
  const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
  if (hash !== PIN.sha256) throw new Error("Published recording hash mismatch");
  const report = JSON.parse(
    new TextDecoder("utf-8", { fatal: true }).decode(bytes),
  );
  if (
    report.version !== 1 ||
    report.command !== "pnpm state:experiment" ||
    report.passed !== true ||
    report.executionError !== null ||
    report.sourceStable !== true ||
    report.consistency.passed !== true ||
    report.consistency.errors.length !== 0 ||
    JSON.stringify(report.sourceBefore) !==
      JSON.stringify(report.sourceAfter) ||
    report.sourceBefore.gitRevision !== PIN.revision ||
    report.sourceBefore.gitDirty !== false ||
    report.sourceBefore.sourceFingerprint !== PIN.source ||
    report.cases.map((c) => c.id).join("|") !== ids.join("|")
  )
    throw new Error("Published capture identity mismatch");
  function fact(index, key) {
    return {
      pointer: `/cases/${index}/facts/${key}`,
      value: structuredClone(report.cases[index].facts[key]),
    };
  }
  function snapshot(index, key) {
    const record = fact(index, key);
    const f = report.cases[index].facts;
    const selected = record.value.state.selectedCandidate;
    const code =
      selected === f.candidate.base
        ? "A"
        : selected === f.candidate.commit
          ? "B"
          : null;
    if (!code) throw new Error("Unexpected selected code");
    return {
      ...record,
      code,
      selected,
      stateOid: record.value.oid,
      receipts: record.value.state.receipts,
    };
  }
  return {
    hash,
    generatedAt: report.generatedAt,
    provenance: structuredClone(report.sourceBefore),
    stop(id) {
      const index = stops.indexOf(id);
      if (index < 0) throw new Error("Unknown stop");
      const f = report.cases[index].facts;
      const worker = fact(index, index === 0 ? "gap" : "worker");
      if (index === 0)
        return {
          index,
          code: f.gapSelection === f.candidate.commit ? "B" : "A",
          selected: f.gapSelection,
          stateOid: null,
          receipts:
            f.gapReceipt === null ? [] : [structuredClone(f.gapReceipt)],
          worker,
          records: [fact(0, "gapSelection"), fact(0, "gapReceipt"), worker],
        };
      const observed = snapshot(index, "observed");
      return {
        ...observed,
        index,
        worker,
        records: [
          observed,
          worker,
          fact(index, "retry"),
          fact(index, "postRetryObserved"),
        ],
      };
    },
    rollback(id) {
      if (!rollbacks.includes(id)) throw new Error("Unknown rollback");
      const before = snapshot(3, id === "preserve" ? "preserved" : "rewound");
      const after = snapshot(
        3,
        id === "preserve" ? "refAfterRefusal" : "afterReplay",
      );
      const action = fact(3, id === "preserve" ? "retryPreserved" : "replay");
      return { before, after, action, records: [before, action, after] };
    },
    reader() {
      return ["capturedInitial", "rereadCurrent", "capturedAgain"].map((key) =>
        snapshot(4, key),
      );
    },
  };
}
