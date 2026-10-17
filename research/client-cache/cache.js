import { copy } from "./copy.js";
import { PIN } from "./pin.js";
import { readRecording, readState, stateSearch, detailIds } from "./model.js";
import { initialLanguage, localizeReadingLinks } from "../preferences.js";

const $ = (id) => document.getElementById(id);
let state = readState(location.search);
let language = initialLanguage(location.search);
let recording;
let failed = false;
const fields = ["promise", "result", "resultError", "stored", "http"];
for (const step of ["failed", "next"]) {
  for (const field of fields) {
    const row = document.createElement("div");
    const label = document.createElement("dt");
    const value = document.createElement("dd");
    label.id = `${step}-${field}-label`;
    value.id = `${step}-${field}`;
    if (field === "http") value.className = "http-count";
    row.append(label, value);
    $(`${step}-values`).append(row);
  }
}
function valueText(value, t) {
  if (value.kind === "empty") return t.empty;
  if (value.kind === "no-result") return t.noResult;
  if (value.kind === "null") return t.nullValue;
  return `${t.quantity} ${value.quantity}`;
}
function renderStep(id, step, t) {
  $(`${id}-policy`).textContent =
    `errorPolicy: ${step.errorPolicy} · fetchPolicy: ${step.fetchPolicy}`;
  const values = {
    promise: step.status === "rejected" ? t.rejected : t.resolved,
    result: valueText(step.resultValue, t),
    resultError: step.hasError ? t.yes : t.no,
    stored: valueText(step.cached, t),
    http: `${step.httpCount} ${step.httpCount === 1 ? t.httpUnitOne : t.httpUnit}`,
  };
  for (const field of fields) {
    $(`${id}-${field}-label`).textContent = t[field];
    $(`${id}-${field}`).textContent = values[field];
  }
}
function render() {
  const t = copy[language];
  document.documentElement.lang = language;
  document.title = `${t.title.replaceAll("\n", " ")} — Minjae Lee`;
  for (const item of document.querySelectorAll("[data-copy]")) {
    item.textContent = t[item.dataset.copy];
  }
  for (const item of document.querySelectorAll("[data-label]")) {
    item.setAttribute("aria-label", t[item.dataset.label]);
  }
  for (const button of document.querySelectorAll("[data-language]")) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language),
    );
  }
  for (const button of document.querySelectorAll("[data-case]")) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.case === state.id),
    );
    button.disabled = !recording;
  }
  for (const id of detailIds) $(id).open = state.details.includes(id);
  $("case-json").setAttribute("aria-label", t.raw);
  $("provenance-json").setAttribute("aria-label", t.provenanceRaw);
  $("integrity").textContent = failed
    ? t.unavailable
    : !recording
      ? t.checking
      : PIN.status === "published"
        ? t.verified
        : t.provisional;
  $("load-message").textContent = failed ? t.loadError : t.loading;
  $("load-message").hidden = Boolean(recording);
  $("comparison-results").hidden = !recording;
  $("raw-link").closest("li").hidden = !recording;
  $("provenance-raw").hidden = !recording;
  for (const [id, path, label] of [
    [
      "design-link",
      `blob/${PIN.docsRevision}/docs/client-cache${language === "ko" ? ".ko" : ""}.md`,
      t.design,
    ],
    ["source-link", `tree/${PIN.revision}`, t.source],
  ]) {
    const link = $(id);
    if (PIN.status === "published") {
      link.href = `https://github.com/minjae-lee-kr/federated-catalog-lab/${path}`;
      link.removeAttribute("aria-disabled");
      link.textContent = label;
    } else {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.textContent = t.pendingSource;
    }
  }
  localizeReadingLinks(document, language);
  if (!recording) return;
  const view = recording.project(state.id);
  $("initial-cache").textContent = view.warm ? t.startWarm : t.startCold;
  renderStep("failed", view.failed, t);
  renderStep("next", view.next, t);
  $("error-data").hidden =
    view.failed.status !== "rejected" || !view.failed.errorData;
  $("case-explanation").textContent = t.explanations[state.id];
  $("case-pointer").textContent = `recording.json#${view.pointer}`;
  $("case-json").textContent = JSON.stringify(view.raw, null, 2);
  $("provenance-json").textContent = JSON.stringify(
    {
      generatedAt: recording.generatedAt,
      sha256: recording.hash,
      source: recording.provenance,
      tooling: recording.tooling,
    },
    null,
    2,
  );
}
function persist() {
  history.replaceState(
    null,
    "",
    `${stateSearch(state, language)}${location.hash}`,
  );
}
function changeLanguage(next) {
  state.details = detailIds.filter((id) => $(id).open);
  // Preserve the visible section and its offset, including the gap above it.
  // At the top, do not convert a positive heading offset into a scroll jump.
  const top = window.scrollY;
  const anchor = [...document.querySelectorAll("[data-reading-section]")].find(
    (item) => item.getBoundingClientRect().bottom > 100,
  );
  const offset = anchor?.getBoundingClientRect().top;
  language = next;
  try {
    localStorage.setItem("minjae.portfolio.language", language);
  } catch {
    /* Storage is optional. */
  }
  persist();
  render();
  if (top === 0) window.scrollTo({ top: 0, behavior: "instant" });
  else if (anchor)
    window.scrollBy({
      top: anchor.getBoundingClientRect().top - offset,
      behavior: "instant",
    });
}
for (const button of document.querySelectorAll("[data-language]")) {
  button.addEventListener("click", () =>
    changeLanguage(button.dataset.language),
  );
}
for (const button of document.querySelectorAll("[data-case]")) {
  button.addEventListener("click", () => {
    state.details = detailIds.filter((id) => $(id).open);
    state.id = button.dataset.case;
    persist();
    render();
  });
}
for (const id of detailIds) {
  $(id).addEventListener("toggle", () => {
    const open = detailIds.filter((name) => $(name).open);
    if (JSON.stringify(open) === JSON.stringify(state.details)) return;
    state.details = open;
    persist();
  });
}
window.addEventListener("popstate", () => {
  state = readState(location.search);
  language = initialLanguage(location.search);
  render();
});
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  const next = initialLanguage(location.search);
  if (next !== language) changeLanguage(next);
});
window.addEventListener("storage", (event) => {
  if (event.key === "minjae.portfolio.language")
    changeLanguage(initialLanguage(""));
});
render();
try {
  const response = await fetch(new URL("./recording.json", import.meta.url), {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Recording unavailable");
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > 2_000_000) throw new Error("Unexpected recording size");
  recording = await readRecording(bytes);
} catch {
  failed = true;
}
render();
