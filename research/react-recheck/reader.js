import { copy } from "./copy.js";
import { PIN } from "./pin.js";
import {
  readRecording,
  readState,
  stateSearch,
  detailIds,
  phases,
} from "./model.js";
import { initialLanguage, localizeReadingLinks } from "../preferences.js";
const $ = (id) => document.getElementById(id);
let state = readState(location.search),
  language = initialLanguage(location.search),
  recording,
  failed = false;
const fields = [
  "http",
  "hookError",
  "previous",
  "errorData",
  "promise",
  "status",
];
for (const field of fields) {
  const row = document.createElement("div"),
    label = document.createElement("dt"),
    value = document.createElement("dd");
  label.id = field + "-label";
  value.id = field + "-value";
  row.append(label, value);
  $("values").append(row);
}
function valueText(v, t) {
  return v.kind === "quantity"
    ? `${v.quantity} ${t.quantity}`
    : v.kind === "null"
      ? t.nullValue
      : v.kind === "no-error"
        ? t.noError
        : t.absent;
}
function render() {
  const t = copy[language];
  document.documentElement.lang = language;
  document.title = t.title + " — Minjae Lee";
  for (const el of document.querySelectorAll("[data-copy]"))
    el.textContent = t[el.dataset.copy];
  for (const el of document.querySelectorAll("[data-label]"))
    el.setAttribute("aria-label", t[el.dataset.label]);
  for (const el of document.querySelectorAll("[data-language]"))
    el.setAttribute("aria-pressed", String(el.dataset.language === language));
  for (const type of ["policy", "step"])
    for (const el of document.querySelectorAll(`[data-${type}]`)) {
      el.setAttribute("aria-pressed", String(el.dataset[type] === state[type]));
      el.disabled = !recording;
    }
  for (const id of detailIds) $(id).open = state.details.includes(id);
  $("integrity").textContent = failed
    ? t.unavailable
    : recording
      ? t.verified
      : t.checking;
  $("load-message").textContent = failed ? t.loadError : t.loading;
  $("load-message").hidden = Boolean(recording);
  $("results").hidden = !recording;
  $("raw-item").hidden = !recording;
  $("provenance-detail").hidden = !recording;
  $("step-json").setAttribute("aria-label", t.raw);
  $("provenance-json").setAttribute("aria-label", t.provenanceRaw);
  for (const [id, path] of [
    [
      "notes-link",
      `blob/${PIN.docsRevision}/docs/react-recheck${language === "ko" ? ".ko" : ""}.md`,
    ],
    ["source-link", `tree/${PIN.revision}/experiments/react-recheck`],
  ]) {
    if (PIN.status === "published") {
      $(id).href =
        "https://github.com/minjae-lee-kr/federated-catalog-lab/" + path;
      $(id).removeAttribute("aria-disabled");
    } else {
      $(id).removeAttribute("href");
      $(id).setAttribute("aria-disabled", "true");
      $(id).textContent = t.pending;
    }
  }
  localizeReadingLinks(document, language);
  if (!recording) return;
  const view = recording.cases[state.policy].steps[phases.indexOf(state.step)];
  $("inventory-value").textContent = valueText(view.data, t);
  const values = {
    http: String(view.http),
    hookError: view.hasError ? t.yes : t.no,
    previous: valueText(view.previous, t),
    errorData: valueText(view.errorData, t),
    promise: t[view.promise],
    status: `${view.networkStatus} / ${view.dataState}`,
  };
  for (const field of fields) {
    $(field + "-label").textContent = t[field];
    $(field + "-value").textContent = values[field];
  }
  $("explanation").textContent =
    state.step === "warm"
      ? t.warmNote
      : state.step === "cache-first"
        ? t.cacheNote
        : state.policy === "all"
          ? t.allFailed
          : t.noneFailed;
  $("step-json").textContent = JSON.stringify(view.raw, null, 2);
  $("provenance-json").textContent = JSON.stringify(
    {
      generatedAt: recording.generatedAt,
      sha256: PIN.sha256,
      source: recording.source,
      tooling: recording.tooling,
      configuration: recording.configuration,
    },
    null,
    2,
  );
}
function persist() {
  history.replaceState(null, "", stateSearch(state, language) + location.hash);
}
function rememberDetails() {
  state.details = detailIds.filter((id) => $(id).open);
}
function changeLanguage(next) {
  rememberDetails();
  const top = scrollY,
    anchor = [...document.querySelectorAll("[data-reading-section]")].find(
      (el) => el.getBoundingClientRect().bottom > 100,
    ),
    offset = anchor?.getBoundingClientRect().top;
  language = next;
  try {
    localStorage.setItem("minjae.portfolio.language", language);
  } catch {}
  persist();
  render();
  if (top === 0) scrollTo({ top: 0, behavior: "instant" });
  else if (anchor)
    scrollBy({
      top: anchor.getBoundingClientRect().top - offset,
      behavior: "instant",
    });
}
for (const el of document.querySelectorAll("[data-language]"))
  el.addEventListener("click", () => changeLanguage(el.dataset.language));
for (const type of ["policy", "step"])
  for (const el of document.querySelectorAll(`[data-${type}]`))
    el.addEventListener("click", () => {
      rememberDetails();
      state[type] = el.dataset[type];
      persist();
      render();
    });
for (const id of detailIds)
  $(id).addEventListener("toggle", () => {
    const current = detailIds.filter((name) => $(name).open);
    if (JSON.stringify(current) !== JSON.stringify(state.details)) {
      state.details = current;
      persist();
    }
  });
addEventListener("popstate", () => {
  state = readState(location.search);
  language = initialLanguage(location.search);
  render();
});
addEventListener("pageshow", (event) => {
  if (event.persisted) {
    state = readState(location.search);
    language = initialLanguage(location.search);
    render();
  }
});
addEventListener("storage", (event) => {
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
  recording = await readRecording(new Uint8Array(await response.arrayBuffer()));
} catch {
  failed = true;
}
render();
