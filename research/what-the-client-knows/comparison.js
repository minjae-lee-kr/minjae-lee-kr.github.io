import { createRecording, readViewState, viewSearch } from "./model.js";
import { initialLanguage, localizeReadingLinks } from "../preferences.js";

const copy = {
  en: {
    skip: "Skip to the comparison",
    back: "/ Engineering notes",
    eyebrow: "AN EXPERIMENT YOU CAN INSPECT",
    title: "Same answer.\nDifferent outcome.",
    lead: "A request loses its response. Later, the service cannot find its key. Is it safe to try again?",
    context:
      "These two runs have identical recorded local HTTP responses and SQLite tables. In one, the downstream operation never happened. In the other, it happened before its deduplication record was pruned. Select a stage to inspect its local journal event.",
    recordLabel: "Recorded experiment · Synthetic input · No live requests",
    compareTitle: "Start with what the caller knows.",
    callerScope:
      "Here the caller is the local service. It can read its own journal, but not the downstream database.",
    unknown: "Response lost",
    absent: "Key not found",
    refused: "Retry refused",
    auditToggle: "Reveal the final downstream audit",
    auditCaution:
      "The caller did not have this evidence when choosing whether to retry. This is the final audit, not a snapshot at the selected step.",
    decisionLabel: "THE DECISION, AND ITS COST",
    decisionTitle: "Stopping does not resolve the outcome.",
    decisionBody:
      "The local policy refuses another dispatch after its retry cutoff. That avoids authorizing a new retry from ambiguous evidence, but it also leaves the request that never ran unresolved. The client needs reconciliation or a stronger server contract; another status label cannot supply the missing history.",
    limit:
      "This comparison does not establish an at-most-once guarantee. A separately recorded late-arrival case shows an already-authorized retry arriving after deduplication expires.",
    fullNote: "Read the design, late-arrival case and limits →",
    provenance: "Follow the evidence.",
    source:
      "The view is derived from an existing capture. Its raw bytes, source fingerprint and mapped relationships are checked before the comparison appears. The clock values are controlled logical time, not latency measurements.",
    raw: "Original JSON recording",
    revision: "Recorded source revision: c60801f",
    reproduce: "Reproduction and verification notes",
    hashLabel: "Raw recording SHA-256",
    home: "← All engineering notes",
    footer: "An independent experiment by Minjae Lee.",
    verified: "Recording integrity checks passed",
    failed: "Recording unavailable",
    error:
      "The recording could not be verified. No comparison is shown. Read the static note below.",
    run: "Run",
    detail: "Inspect this record",
    finalDetail: "Inspect final audit",
    clock: "Logical clock",
    identical: "Same local journal. No basis here to tell the runs apart.",
    effects: "downstream operations",
    zero: "Nothing executed. Stopping still leaves the request unresolved.",
    one: "One operation executed. Its retained key disappeared; the operation did not.",
    remoteEvents: {
      "post-drop-before-commit": "Request dropped before commit",
      "post-new-effect": "Operation committed",
      "dedup-pruned": "Deduplication record removed",
      "lookup-absent": "Lookup found no retained key",
    },
    explanations: {
      unknown:
        "The first dispatch ended in a transport error. A missing response tells the caller nothing about whether the operation committed.",
      absent:
        "At logical time 12000, lookup returns no retained key. The same absence fits both “never executed” and “executed, then forgotten.”",
      refused:
        "The retry cutoff was 10900. The policy refuses a new dispatch at 12000 in both runs. It cannot choose differently from identical local evidence.",
    },
  },
  ko: {
    skip: "비교 화면으로 건너뛰기",
    back: "/ 엔지니어링 노트",
    eyebrow: "실행 기록으로 살펴보는 설계",
    title: "응답은 같은데,\n결과는 다릅니다.",
    lead: "요청을 보냈지만 응답이 오지 않았습니다. 나중에 조회해도 키가 없습니다. 다시 보내도 될까요?",
    context:
      "기록된 로컬 HTTP 응답과 SQLite 테이블이 같은 두 실행입니다. 한쪽은 작업이 실행되지 않았고, 다른 쪽은 실행된 뒤 보존 기간을 넘긴 중복 방지 기록이 삭제됐습니다. 단계를 선택하면 해당 로컬 이벤트를 볼 수 있습니다.",
    recordLabel: "저장된 실행 기록 · 가상 입력 · 실시간 요청 없음",
    compareTitle: "요청을 보낸 쪽이 아는 것부터 봅니다.",
    callerScope:
      "여기서 요청을 보내는 쪽은 로컬 서비스입니다. 자체 기록은 볼 수 있지만, 상대 서버의 DB는 볼 수 없습니다.",
    unknown: "응답을 잃음",
    absent: "키를 찾지 못함",
    refused: "재시도를 거절함",
    auditToggle: "실행 종료 후 서버 감사 기록 보기",
    auditCaution:
      "재시도를 결정하던 로컬에는 없었던 근거입니다. 선택한 시점의 스냅샷이 아니라, 실행이 끝난 뒤 수집한 기록입니다.",
    decisionLabel: "선택과 그 대가",
    decisionTitle: "멈췄다고 해결된 것은 아닙니다.",
    decisionBody:
      "로컬 정책은 재시도 마감을 넘기면 새 요청을 보내지 않습니다. 모호한 근거로 재시도를 허용하지 않는 대신, 실제로 한 번도 실행되지 않은 요청도 미해결 상태로 남깁니다. 결과를 대조해 확정하는 절차나 더 강한 서버 계약이 필요합니다. 상태 이름을 하나 더 만든다고 사라진 이력을 알 수는 없습니다.",
    limit:
      "이 비교가 최대 한 번 실행을 보장하는 것은 아닙니다. 별도의 지연 도착 사례에서는 이미 허용된 재시도가 중복 방지 기록 만료 후 도착합니다.",
    fullNote: "전체 설계와 지연 도착 사례, 남은 한계 읽기 →",
    provenance: "근거를 따라가 보세요.",
    source:
      "기존 실행 기록에서 값을 읽어 표시합니다. 원본 바이트와 소스 지문, 기록 사이의 관계를 확인한 뒤 비교 화면을 엽니다. 시계 값은 실험에서 제어한 논리 시간이며, 처리 속도 측정값이 아닙니다.",
    raw: "원본 JSON 실행 기록",
    revision: "실행 당시 소스: c60801f",
    reproduce: "재현·검증 방법",
    hashLabel: "원본 실행 기록 SHA-256",
    home: "← 전체 엔지니어링 노트",
    footer: "이민재의 독립적인 개인 실험입니다.",
    verified: "기록 무결성 검사 통과",
    failed: "실행 기록 확인 불가",
    error:
      "실행 기록을 검증하지 못해 비교 화면을 표시하지 않습니다. 아래 상세 노트에서 내용을 확인할 수 있습니다.",
    run: "실행",
    detail: "해당 원본 보기",
    finalDetail: "종료 후 감사 기록 보기",
    clock: "논리 시계",
    identical:
      "로컬 기록이 같습니다. 이 근거만으로 두 실행을 구별할 수 없습니다.",
    effects: "서버에서 실행된 작업",
    zero: "작업이 실행되지 않았습니다. 멈추면 요청은 여전히 미해결 상태입니다.",
    one: "작업은 한 번 실행됐습니다. 사라진 것은 보관하던 키이지, 실행 결과가 아닙니다.",
    remoteEvents: {
      "post-drop-before-commit": "실행 전에 요청을 끊음",
      "post-new-effect": "작업 실행 결과를 저장함",
      "dedup-pruned": "중복 방지 기록을 삭제함",
      "lookup-absent": "조회한 키가 없다고 응답함",
    },
    explanations: {
      unknown:
        "첫 요청은 통신 오류로 끝났습니다. 응답을 못 받았다는 사실만으로 서버의 작업 실행 여부를 알 수는 없습니다.",
      absent:
        "논리 시간 12000에 조회했지만 보관된 키가 없습니다. 처음부터 실행되지 않았어도, 실행 후 기록이 만료됐어도 같은 응답입니다.",
      refused:
        "재시도 마감은 10900이었습니다. 정책은 두 실행 모두 12000의 새 요청을 거절합니다. 로컬 근거가 같으므로 서로 다른 판단을 내릴 수 없습니다.",
    },
  },
};

const state = readViewState(location.search);
state.lang = initialLanguage(location.search);
let recording;
let failure = false;
const expanded = new Set();
const $ = (id) => document.getElementById(id);
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

function detail(id, title, value, pointer) {
  const node = element("details", undefined, "record-detail");
  node.dataset.record = id;
  node.open = expanded.has(id);
  const raw = element("pre", JSON.stringify(value, null, 2));
  raw.tabIndex = 0;
  raw.setAttribute("role", "region");
  raw.setAttribute("aria-label", `${title}: ${pointer}`);
  node.append(element("summary", title), element("code", pointer), raw);
  node.addEventListener("toggle", () => {
    if (node.isConnected) node.open ? expanded.add(id) : expanded.delete(id);
  });
  return node;
}

function render() {
  localizeReadingLinks(document, state.lang);
  document.querySelectorAll("[data-record]").forEach((item) => {
    item.open
      ? expanded.add(item.dataset.record)
      : expanded.delete(item.dataset.record);
  });
  const t = copy[state.lang];
  document.documentElement.lang = state.lang;
  document.title = `${t.title.replaceAll("\n", " ")} — Minjae Lee`;
  document.querySelectorAll("[data-copy]").forEach((node) => {
    node.textContent = t[node.dataset.copy];
  });
  document
    .querySelectorAll("[data-language]")
    .forEach((node) =>
      node.setAttribute(
        "aria-pressed",
        String(node.dataset.language === state.lang),
      ),
    );
  document
    .querySelectorAll("[data-stage]")
    .forEach((node) =>
      node.setAttribute(
        "aria-pressed",
        String(node.dataset.stage === state.stage),
      ),
    );
  document.querySelector('[data-copy="reproduce"]').href =
    `https://github.com/minjae-lee-kr/intent-recovery-lab/blob/fb4373e82951d2d1822177c88e9f34b263fa609d/docs/retention-boundary${state.lang === "ko" ? ".ko" : ""}.md`;
  $("stages").setAttribute(
    "aria-label",
    state.lang === "ko" ? "실행 기록 단계" : "Recorded stage",
  );
  $("stage-explanation").textContent = t.explanations[state.stage];
  $("stage-explanation").hidden = !recording;
  document.querySelector(".audit-control").hidden = !recording;
  $("recording-hash").closest("details").hidden = !recording;
  document.querySelectorAll("[data-stage]").forEach((button) => {
    button.disabled = failure;
  });
  $("audit").checked = state.audit;
  $("audit").disabled = !recording;
  $("integrity").textContent = failure
    ? t.failed
    : recording
      ? t.verified
      : "…";
  if (!recording) {
    if (failure)
      $("runs").replaceChildren(element("p", t.error, "recording-error"));
    return;
  }
  const view = recording.project(state.stage, state.audit);
  $("runs").replaceChildren(
    ...view.rows.map((row, index) => {
      const card = element("article", undefined, "run-card");
      card.append(
        element("h3", `${t.run} ${index === 0 ? "A" : "B"}`),
        element("strong", row.event.event, "event-name"),
        element("p", `${t.clock}: ${row.event.clock}`, "clock"),
        detail(`${row.id}-local`, t.detail, row.event, row.pointer),
      );
      return card;
    }),
  );
  $("runs").setAttribute("aria-busy", "false");
  $("equality").textContent = view.equal ? t.identical : "";
  $("audit-results").hidden = !state.audit;
  $("audit-results").replaceChildren();
  if (state.audit) {
    const grid = element("div", undefined, "audit-grid");
    for (const [index, row] of view.rows.entries()) {
      const card = element("article", undefined, "run-card audit-card");
      const timeline = element("ol", undefined, "audit-timeline");
      for (const event of row.audit.remoteJournal) {
        const item = element("li");
        item.append(
          element("span", `${event.clock}`, "audit-time"),
          element("span", t.remoteEvents[event.event] ?? event.event),
        );
        timeline.append(item);
      }
      card.append(
        element("h3", `${t.run} ${index === 0 ? "A" : "B"}`),
        element("strong", String(row.audit.effects.length), "effect-count"),
        element("span", t.effects),
        element("p", t[row.id]),
        timeline,
        detail(
          `${row.id}-audit`,
          t.finalDetail,
          {
            effects: row.audit.effects,
            remoteJournal: row.audit.remoteJournal,
          },
          `${row.audit.effectsPointer} · ${row.audit.journalPointer}`,
        ),
      );
      grid.append(card);
    }
    $("audit-results").append(grid);
  }
  $("recording-hash").textContent = recording.rawSha256;
}

function update() {
  history.replaceState(null, "", `${viewSearch(state)}${location.hash}`);
  render();
}
document.querySelectorAll("[data-language]").forEach((button) =>
  button.addEventListener("click", () => {
    state.lang = button.dataset.language;
    try {
      localStorage.setItem("minjae.portfolio.language", state.lang);
    } catch {
      /* Storage is optional. */
    }
    update();
  }),
);
document.querySelectorAll("[data-stage]").forEach((button) =>
  button.addEventListener("click", () => {
    state.stage = button.dataset.stage;
    update();
  }),
);
$("audit").addEventListener("change", () => {
  state.audit = $("audit").checked;
  update();
});
window.addEventListener("popstate", () => {
  const next = readViewState(location.search);
  next.lang = initialLanguage(location.search);
  if (viewSearch(next) === viewSearch(state)) return;
  Object.assign(state, next);
  render();
});
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  const next = initialLanguage(location.search);
  if (next === state.lang) return;
  state.lang = next;
  update();
});
render();
try {
  const base = new URL("../../notes/retention-boundary/", import.meta.url);
  const responses = await Promise.all(
    ["recording/evidence.json", "mapping.json", "recording.json"].map(
      async (file) => {
        const response = await fetch(new URL(file, base), {
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`Recording HTTP ${response.status}`);
        return response;
      },
    ),
  );
  recording = await createRecording(
    new Uint8Array(await responses[0].arrayBuffer()),
    new Uint8Array(await responses[1].arrayBuffer()),
    await responses[2].json(),
  );
} catch (error) {
  failure = true;
  $("runs").setAttribute("aria-busy", "false");
  console.error("Historical comparison unavailable:", error);
}
render();
