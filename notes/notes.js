(() => {
  "use strict";
  const key = "minjae.portfolio.language";
  const languages = new Set(["ko", "en"]);
  const browserLanguage = () =>
    String(navigator.language || "")
      .toLowerCase()
      .startsWith("ko")
      ? "ko"
      : "en";
  let language = browserLanguage();
  const readPreference = () => {
    try {
      const saved = localStorage.getItem(key);
      return languages.has(saved) ? saved : browserLanguage();
    } catch {
      return language;
    }
  };
  const header = document.querySelector(".site-header");
  const sections = [...document.querySelectorAll("[data-reading-section]")];
  const capturePosition = () => {
    const marker = (header?.getBoundingClientRect().bottom || 0) + 22;
    const section =
      sections.find(
        (element) => element.getBoundingClientRect().bottom > marker,
      ) || sections.at(-1);
    if (!section) return null;
    const bounds = section.getBoundingClientRect();
    return {
      section,
      marker,
      fraction: Math.max(
        0,
        Math.min(1, (marker - bounds.top) / Math.max(1, bounds.height)),
      ),
    };
  };
  const apply = (next, preserve = true, announce = false) => {
    if (!languages.has(next)) return;
    const changed = document.documentElement.lang !== next;
    const position = preserve && changed ? capturePosition() : null;
    const focused = document.activeElement;
    const focusKey = focused?.getAttribute("data-focus-key");
    const containingSection = focused?.closest("[data-reading-section]");
    language = next;
    document.documentElement.lang = next;
    for (const element of document.querySelectorAll("[data-lang]"))
      element.hidden = element.dataset.lang !== next;
    for (const button of document.querySelectorAll("[data-language]"))
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.language === next),
      );
    for (const element of document.querySelectorAll("[data-label-ko]"))
      element.setAttribute(
        "aria-label",
        element.getAttribute(`data-label-${next}`),
      );
    const title = document.body.getAttribute(`data-title-${next}`);
    if (title) document.title = `${title} — Minjae Lee`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.content =
        document.body.getAttribute(`data-description-${next}`) || "";
    if (changed && focused?.closest("[hidden]")) {
      const replacement =
        focusKey &&
        [...document.querySelectorAll("[data-focus-key]")].find(
          (element) =>
            element.getAttribute("data-focus-key") === focusKey &&
            !element.closest("[hidden]"),
        );
      (replacement || containingSection)?.focus({ preventScroll: true });
    }
    if (position) {
      const bounds = position.section.getBoundingClientRect();
      window.scrollBy({
        top: bounds.top + bounds.height * position.fraction - position.marker,
        behavior: "instant",
      });
    }
    if (announce)
      document.querySelector("#language-status").textContent =
        next === "ko" ? "한국어로 표시합니다." : "The note is now in English.";
    else if (changed)
      document.querySelector("#language-status").textContent = "";
  };
  for (const button of document.querySelectorAll("[data-language]"))
    button.addEventListener("click", () => {
      const next = button.dataset.language;
      if (!languages.has(next)) return;
      try {
        localStorage.setItem(key, next);
      } catch {
        /* Reading and switching still work without storage. */
      }
      apply(next, true, true);
    });
  window.addEventListener("pageshow", () => apply(readPreference(), true));
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) apply(readPreference(), true);
  });
  apply(readPreference(), false);
})();
