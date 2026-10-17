import { initialLanguage, localizeReadingLinks } from "../preferences.js";
import {
  PIN,
  readRecording,
  readState,
  stateSearch,
  detailIds,
} from "./model.js";
import { copy } from "./copy.js";
import { EXPIRY_PIN } from "./expiry-pin.js";

const state = readState(location.search);
let language = initialLanguage(location.search);
let recording;
let failed = false;
let syncingDetails = false;
const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
function node(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}
function persist() {
  try {
    localStorage.setItem("minjae.portfolio.language", language);
  } catch {
    /* Storage is optional. */
  }
  history.replaceState(
    null,
    "",
    `${location.pathname}${stateSearch(state, language)}${location.hash}`,
  );
}
function snapshot(target, view) {
  const t = copy[language];
  const dl = document.createElement("dl");
  const code = document.createElement("div");
  const receipt = document.createElement("div");
  code.append(node("dt", t.selectedCode));
  const codeValue = node("dd", "");
  codeValue.append(
    node("strong", view.code, "state-value code-value"),
    node("span", view.code === "A" ? t.baseline : t.candidate, "value-note"),
    node("code", `${t.codeOid}: ${view.selected}`, "oid"),
  );
  code.append(codeValue);
  receipt.append(node("dt", t.receipt));
  const receiptValue = node("dd", "");
  receiptValue.append(
    node("strong", view.receipts.length ? t.present : t.absent, "state-value"),
  );
  receipt.append(receiptValue);
  dl.append(code, receipt);
  target.replaceChildren(
    node("p", view.stateOid ? t.sameState : t.separatePair, "pair-caption"),
    dl,
  );
  if (view.stateOid)
    target.append(
      node("code", `${t.stateOid}: ${view.stateOid}`, "oid state-oid"),
    );
}
function raw(target, records) {
  const container = $(`${target} .raw-records`);
  container.replaceChildren();
  for (const record of records) {
    const pre = node("pre", JSON.stringify(record.value, null, 2));
    pre.tabIndex = 0;
    pre.setAttribute("role", "region");
    pre.setAttribute("aria-label", record.pointer);
    container.append(node("code", record.pointer), pre);
  }
}
function render() {
  localizeReadingLinks(document, language);
  const t = copy[language];
  document.documentElement.lang = language;
  document.title = `${t.title.replaceAll("\n", " ")} — Minjae Lee`;
  all("[data-copy]").forEach((el) => {
    el.textContent = t[el.dataset.copy];
  });
  all("[data-label]").forEach((el) =>
    el.setAttribute("aria-label", t[el.dataset.label]),
  );
  all("[data-language]").forEach((el) =>
    el.setAttribute("aria-pressed", String(el.dataset.language === language)),
  );
  all("[data-stop]").forEach((el) => {
    el.disabled = !recording;
    el.setAttribute("aria-pressed", String(el.dataset.stop === state.stop));
  });
  all("[data-rollback]").forEach((el) =>
    el.setAttribute(
      "aria-pressed",
      String(el.dataset.rollback === state.rollback),
    ),
  );
  $("#integrity").textContent = failed
    ? t.failed
    : recording
      ? t.verified
      : t.checking;
  $("#load-message").textContent = failed ? t.loadError : t.loading;
  $("#load-message").hidden = Boolean(recording);
  all("[data-observations]").forEach((el) => {
    el.hidden = !recording;
  });
  $("#design-link").href =
    `https://github.com/minjae-lee-kr/verified-change-lab/blob/${PIN.docsRevision}/docs/state-envelope${language === "ko" ? ".ko" : ""}.md`;
  $("#expiry-link").href =
    `https://github.com/minjae-lee-kr/verified-change-lab/blob/${EXPIRY_PIN.revision}/docs/approval-expiry${language === "ko" ? ".ko" : ""}.md`;
  if (!recording) return;
  const stop = recording.stop(state.stop);
  $("#stop-explanation").textContent = t.stopExplain[state.stop];
  snapshot($("#stop-snapshot"), stop);
  $("#stop-fence").textContent = t.ackAbsent;
  raw("#stop-raw", stop.records);
  const rollback = recording.rollback(state.rollback);
  $("#rollback-explanation").textContent = t.rollbackExplain[state.rollback];
  snapshot($("#rollback-before"), rollback.before);
  snapshot($("#rollback-after"), rollback.after);
  $("#rollback-result").textContent =
    state.rollback === "preserve" ? t.preservedResult : t.rewindResult;
  raw("#rollback-raw", rollback.records);
  const readers = recording.reader();
  const list = $("#reader-observations");
  list.replaceChildren();
  readers.forEach((view, i) => {
    const item = document.createElement("li");
    const card = node("div", "", "snapshot");
    snapshot(card, view);
    item.append(node("h3", t.readerLabels[i], "observation-label"), card);
    list.append(item);
  });
  raw("#reader-raw", readers);
  $("#provenance-data").textContent = JSON.stringify(
    {
      generatedAt: recording.generatedAt,
      sourceRevision: PIN.revision,
      gitDirty: recording.provenance.gitDirty,
      sourceFingerprint: PIN.source,
      nodeVersion: recording.provenance.nodeVersion,
      gitVersion: recording.provenance.gitVersion,
      recordingSHA256: recording.hash,
    },
    null,
    2,
  );
}
function restoreDetails() {
  syncingDetails = true;
  detailIds.forEach((id) => {
    $(`#${id}`).open = state.details.includes(id);
  });
  syncingDetails = false;
}
all("[data-language]").forEach((button) =>
  button.addEventListener("click", () => {
    language = button.dataset.language;
    render();
    persist();
  }),
);
all("[data-stop]").forEach((button) =>
  button.addEventListener("click", () => {
    state.stop = button.dataset.stop;
    render();
    persist();
  }),
);
all("[data-rollback]").forEach((button) =>
  button.addEventListener("click", () => {
    state.rollback = button.dataset.rollback;
    render();
    persist();
  }),
);
detailIds.forEach((id) =>
  $(`#${id}`).addEventListener("toggle", () => {
    if (syncingDetails) return;
    state.details = detailIds.filter((id) => $(`#${id}`).open);
    persist();
  }),
);
window.addEventListener("popstate", () => {
  const next = readState(location.search);
  const nextLanguage = initialLanguage(location.search);
  const sameView =
    next.stop === state.stop &&
    next.rollback === state.rollback &&
    nextLanguage === language;
  Object.assign(state, next);
  language = nextLanguage;
  restoreDetails();
  // Hash-only navigation and restored pages must not replace a focused raw node.
  if (sameView) return;
  render();
});
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  const next = initialLanguage(location.search);
  if (next === language) return;
  language = next;
  render();
  persist();
});
restoreDetails();
render();
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10_000);
try {
  const response = await fetch("recording.json", {
    cache: "no-store",
    signal: controller.signal,
  });
  if (!response.ok) throw new Error("Recording HTTP failure");
  recording = await readRecording(await response.arrayBuffer());
} catch {
  recording = undefined;
  failed = true;
} finally {
  clearTimeout(timeout);
}
render();
