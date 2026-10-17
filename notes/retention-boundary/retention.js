import { validateBundle } from "./contract.js";

const accessLabels = {
  policy: ["재시도 정책이 가진 정보", "Available to the retry policy"],
  harness: [
    "실험 제어기의 관측; 정책은 읽지 못함",
    "Fixture controller observation; unavailable to the policy",
  ],
  auditor: [
    "종료 후 감사기만 열람; 정책은 읽지 못함",
    "Privileged post-stop audit; unavailable to the policy",
  ],
  client: ["로컬 API 호출자 응답", "Local API caller response"],
};

function translated(element, ko, en) {
  const document = element.ownerDocument;
  element.replaceChildren();
  for (const [language, value] of [
    ["ko", ko],
    ["en", en],
  ]) {
    const span = document.createElement("span");
    span.dataset.lang = language;
    span.lang = language;
    span.hidden = document.documentElement.lang !== language;
    span.textContent = value;
    element.append(span);
  }
}

export function attachRecording(view, doc = document) {
  const caseSelects = [...doc.querySelectorAll("[data-case-select]")];
  const recordSelects = [...doc.querySelectorAll("[data-record-select]")];
  const state = {
    selectedCase: "zero",
    records: { zero: "zero-unknown", one: "one-unknown", late: "late-retry" },
  };
  const choices = (prefix) =>
    view.mapping.selections.filter((entry) =>
      entry.id.startsWith(prefix + "-"),
    );
  function showRecord() {
    const current = state.records[state.selectedCase];
    const entry = view.selected.get(current);
    for (const select of recordSelects) select.value = current;
    doc.getElementById("record-pointer").textContent = entry.pointer;
    doc.getElementById("record-json").textContent = JSON.stringify(
      entry.actual,
      null,
      2,
    );
    const stream = entry.pointer.includes("/observations/")
      ? ["부모 관측", "Parent observations"]
      : entry.pointer.includes("/localJournal")
        ? ["로컬 SQLite 기록", "Local SQLite journal"]
        : entry.pointer.includes("/remoteJournal")
          ? ["상대 SQLite 기록", "Downstream SQLite journal"]
          : ["상대 DB 효과 테이블", "Downstream effects table"];
    translated(doc.getElementById("record-stream"), ...stream);
    translated(
      doc.getElementById("record-access"),
      ...accessLabels[entry.visibility],
    );
    const sequence = Array.isArray(entry.actual)
      ? null
      : (entry.actual.seq ?? entry.actual.sequence);
    translated(
      doc.getElementById("record-sequence"),
      sequence ? String(sequence) : "전체 목록; 단일 순번 없음",
      sequence ? String(sequence) : "Complete list; no single sequence number",
    );
  }
  function showCase() {
    for (const select of caseSelects) select.value = state.selectedCase;
    for (const select of recordSelects) {
      select.replaceChildren();
      for (const entry of choices(state.selectedCase)) {
        const option = doc.createElement("option");
        option.value = entry.id;
        option.textContent = entry.label[select.dataset.selectLanguage];
        select.append(option);
      }
    }
    showRecord();
  }
  for (const select of caseSelects)
    select.addEventListener("change", () => {
      if (!Object.hasOwn(state.records, select.value)) return;
      state.selectedCase = select.value;
      showCase();
    });
  for (const select of recordSelects)
    select.addEventListener("change", () => {
      if (
        !choices(state.selectedCase).some((entry) => entry.id === select.value)
      )
        return;
      state.records[state.selectedCase] = select.value;
      showRecord();
    });
  for (const link of doc.querySelectorAll("[data-record]"))
    link.addEventListener("click", () => {
      const entry = view.selected.get(link.dataset.record);
      if (!entry) return;
      state.selectedCase = entry.id.split("-")[0];
      state.records[state.selectedCase] = entry.id;
      showCase();
    });
  for (const element of doc.querySelectorAll("[data-metric]"))
    element.textContent = String(view.metrics[element.dataset.metric]);
  for (const element of doc.querySelectorAll("[data-clock]"))
    element.textContent =
      view.clocks[element.dataset.clock].toLocaleString("en-US");
  showCase();
}

export async function loadRecording(fetcher = fetch) {
  const paths = ["recording/evidence.json", "mapping.json", "recording.json"];
  const responses = await Promise.all(
    paths.map(async (path) => {
      const response = await fetcher(new URL(path, import.meta.url), {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Required recording file unavailable");
      return new Uint8Array(await response.arrayBuffer());
    }),
  );
  return validateBundle(
    responses[0],
    responses[1],
    JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(responses[2])),
  );
}

export async function startNote(doc = document, loader = loadRecording) {
  doc.getElementById("verified-content").hidden = true;
  try {
    const view = await loader();
    attachRecording(view, doc);
    doc.getElementById("mismatch").hidden = true;
    doc.getElementById("verified-content").hidden = false;
    doc.documentElement.dataset.evidence = "verified";
  } catch {
    // No fallback successful narrative, partial graphics or untrusted error HTML.
    doc.getElementById("verified-content").hidden = true;
    doc.getElementById("mismatch").hidden = false;
    doc.documentElement.dataset.evidence = "mismatch";
  } finally {
    doc.getElementById("load-status").hidden = true;
  }
}

if (typeof document !== "undefined") void startNote();
