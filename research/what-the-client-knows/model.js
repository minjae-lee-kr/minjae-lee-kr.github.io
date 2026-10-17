import {
  validateBundle,
  PIN,
} from "../../notes/retention-boundary/contract.js";

export const stages = ["unknown", "absent", "refused"];
const journalEnds = [3, 5, 6];
const cases = [
  { id: "zero", index: 3 },
  { id: "one", index: 2 },
];

export function readViewState(search = "") {
  const params = new URLSearchParams(search);
  return {
    stage: stages.includes(params.get("stage"))
      ? params.get("stage")
      : "unknown",
    audit: params.get("audit") === "1",
    lang: params.get("lang") === "ko" ? "ko" : "en",
  };
}

export function viewSearch(state) {
  if (!stages.includes(state.stage)) throw new Error("Unknown stage");
  const params = new URLSearchParams({
    stage: state.stage,
    lang: state.lang === "ko" ? "ko" : "en",
  });
  if (state.audit) params.set("audit", "1");
  return `?${params}`;
}

// This is a presentation boundary, not access control. All evidence is public.
// Callers receive only the selected local journal prefix until they request audit.
export async function createRecording(raw, mapping, manifest) {
  const { report } = await validateBundle(raw, mapping, manifest);
  return {
    revision: PIN.revision,
    rawSha256: PIN.rawSha256,
    project(stage, audit = false) {
      const offset = stages.indexOf(stage);
      if (offset < 0) throw new Error("Unknown stage");
      const rows = cases.map(({ id, index }) => {
        const evidence = report.cases[index].audit;
        const journal = structuredClone(
          evidence.localJournal.slice(0, journalEnds[offset]),
        );
        const row = {
          id,
          journal,
          event: journal.at(-1),
          pointer: `/cases/${index}/audit/localJournal/${journal.length - 1}`,
        };
        if (audit)
          row.audit = {
            // Final audit data, never presented as a reconstruction of intermediate time.
            effects: structuredClone(evidence.effects),
            remoteJournal: structuredClone(evidence.remoteJournal),
            effectsPointer: `/cases/${index}/audit/effects`,
            journalPointer: `/cases/${index}/audit/remoteJournal`,
          };
        return row;
      });
      return {
        stage,
        rows,
        equal:
          JSON.stringify(rows[0].journal) === JSON.stringify(rows[1].journal),
      };
    },
  };
}
