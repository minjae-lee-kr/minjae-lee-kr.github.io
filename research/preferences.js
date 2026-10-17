export function preferredLanguage(search, saved, browserLanguage) {
  const requested = new URLSearchParams(search).get("lang");
  if (requested === "ko" || requested === "en") return requested;
  if (saved === "ko" || saved === "en") return saved;
  return typeof browserLanguage === "string" &&
    browserLanguage.toLowerCase().startsWith("ko")
    ? "ko"
    : "en";
}

export function initialLanguage(search) {
  let saved;
  try {
    saved = localStorage.getItem("minjae.portfolio.language");
  } catch {
    /* Browser storage is optional. */
  }
  return preferredLanguage(search, saved, navigator.language);
}

export function readingLink(href, base, language) {
  if (!href || href.startsWith("#") || !["ko", "en"].includes(language))
    return href;
  const current = new URL(base);
  const target = new URL(href, current);
  if (
    target.origin !== current.origin ||
    !(target.pathname.endsWith("/") || target.pathname.endsWith(".html"))
  )
    return href;
  target.searchParams.set("lang", language);
  return target.pathname + target.search + target.hash;
}

export function localizeReadingLinks(root, language) {
  for (const link of root.querySelectorAll("a[href]:not([download])")) {
    const href = link.getAttribute("href");
    link.setAttribute("href", readingLink(href, location.href, language));
  }
}
