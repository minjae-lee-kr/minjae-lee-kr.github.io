import { copy } from "./copy.js";
import { caseCopy } from "./cases.js";
import { PIN } from "./pin.js";
import { readRecording, readState, stateSearch, detailIds } from "./model.js";
import { initialLanguage, localizeReadingLinks } from "../preferences.js";
const $ = (id) => document.getElementById(id);
let state = readState(location.search),
  language = initialLanguage(location.search),
  recording,
  failed = false;
const fields = [
  "display",
  "before",
  "attempt",
  "active",
  "cacheA",
  "cacheB",
  "cacheWest",
  "http",
];
for (const mode of ["baseline", "managed"])
  for (const field of fields) {
    const row = document.createElement("div"),
      label = document.createElement("dt"),
      value = document.createElement("dd");
    label.id = `${mode}-${field}-label`;
    value.id = `${mode}-${field}`;
    row.append(label, value);
    $(mode + "-values").append(row);
  }
function scopeText(scope) {
  return `${scope.sku === "demo-a" ? "A" : "B"} / ${scope.warehouse}`;
}
function quantity(value, t) {
  return value === null
    ? t.unknown
    : value === undefined
      ? t.empty
      : `${value} ${t.quantity}`;
}
function showRun(id, run, t) {
  const values = {
    display: quantity(run.display, t),
    before: quantity(run.before, t),
    attempt: `${t[run.attempt.status]}${run.attempt.id === null ? "" : ` · #${run.attempt.id}`}`,
    active: scopeText(run.scope),
    cacheA: quantity(run.cache.a, t),
    cacheB: quantity(run.cache.b, t),
    cacheWest: quantity(run.cache.west, t),
    http: String(run.http),
  };
  for (const field of fields) {
    $(`${id}-${field}-label`).textContent = t[field];
    $(`${id}-${field}`).textContent = values[field];
  }
  const list = $(id + "-decisions");
  list.replaceChildren();
  for (const decision of run.decisions) {
    const li = document.createElement("li");
    li.textContent = `#${decision.token.id} · ${scopeText(decision.token.scope)} · ${decision.accepted ? t.accepted : t.discarded} · ${t[decision.outcome]} · ${decision.cacheWrite ? t.explicitWrite : t.noWrite}`;
    list.append(li);
  }
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
  for (const el of document.querySelectorAll("[data-case]")) {
    el.setAttribute("aria-pressed", String(el.dataset.case === state.id));
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
  $("case-json").setAttribute("aria-label", t.raw);
  $("provenance-json").setAttribute("aria-label", t.provenanceRaw);
  for (const [id, path] of [
    [
      "notes-link",
      `blob/${PIN.docsRevision}/docs/react-attempts${language === "ko" ? ".ko" : ""}.md`,
    ],
    ["source-link", `tree/${PIN.revision}/experiments/react-attempts`],
  ]) {
    if (PIN.status === "published") {
      $(id).href =
        "https://github.com/minjae-lee-kr/federated-catalog-lab/" + path;
      $(id).removeAttribute("aria-disabled");
    } else {
      $(id).removeAttribute("href");
      $(id).setAttribute("aria-disabled", "true");
      $(id).textContent = t.pendingSource;
    }
  }
  localizeReadingLinks(document, language);
  if (!recording) return;
  const view = recording.cases[state.id];
  $("case-intro").textContent = caseCopy[language][state.id].intro;
  $("case-takeaway").textContent = caseCopy[language][state.id].takeaway;
  const order = $("release-order");
  order.replaceChildren();
  for (const release of view.releases) {
    const li = document.createElement("li");
    li.textContent = `${t[release.slot]} · ${scopeText(release.scope)} · ${release.failed ? t.failed : quantity(release.quantity, t)}`;
    order.append(li);
  }
  showRun("baseline", view.baseline, t);
  showRun("managed", view.managed, t);
  $("case-json").textContent = JSON.stringify(view.raw, null, 2);
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
function remember() {
  state.details = detailIds.filter((id) => $(id).open);
}
function changeLanguage(next) {
  remember();
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
for (const el of document.querySelectorAll("[data-case]"))
  el.addEventListener("click", () => {
    remember();
    state.id = el.dataset.case;
    persist();
    render();
  });
for (const id of detailIds)
  $(id).addEventListener("toggle", () => {
    const next = detailIds.filter((name) => $(name).open);
    if (JSON.stringify(next) !== JSON.stringify(state.details)) {
      state.details = next;
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
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("Recording unavailable");
  recording = await readRecording(new Uint8Array(await response.arrayBuffer()));
} catch {
  failed = true;
}
render();
