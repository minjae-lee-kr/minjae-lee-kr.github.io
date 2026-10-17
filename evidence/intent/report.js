(() => {
  const key = 'minjae.portfolio.language';
  let lang = navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'ko' || saved === 'en') lang = saved;
  } catch {}
  const apply = () => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'ko' ? 'Intent / Recovery — 실험 근거' : 'Intent / Recovery — Experiment evidence';
    document
      .querySelectorAll('[data-set-lang]')
      .forEach((button) =>
        button.setAttribute('aria-pressed', String(button.dataset.setLang === lang)),
      );
  };
  document.querySelectorAll('[data-set-lang]').forEach((button) =>
    button.addEventListener('click', () => {
      lang = button.dataset.setLang;
      try {
        localStorage.setItem(key, lang);
      } catch {}
      apply();
      portfolioEvidenceSelect();
    }),
  );

// Portfolio display language: explicit URL, then shared preference, then browser default.
function portfolioEvidenceLanguage() {
  const linked = new URLSearchParams(location.search).get('lang');
  if (linked === 'ko' || linked === 'en') return linked;
  try {
    const saved = localStorage.getItem('minjae.portfolio.language');
    if (saved === 'ko' || saved === 'en') return saved;
  } catch { /* Storage is optional. */ }
  return lang;
}
function portfolioEvidenceLinks() {
  for (const link of document.querySelectorAll('a[href]:not([download])')) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) continue;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !(url.pathname.endsWith('/') || url.pathname.endsWith('.html'))) continue;
    url.searchParams.set('lang', lang);
    link.setAttribute('href', url.pathname + url.search + url.hash);
  }
}
function portfolioEvidenceSelect() {
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(history.state, '', url);
  portfolioEvidenceLinks();
}
function portfolioEvidenceRestore() {
  const next = portfolioEvidenceLanguage();
  if (next === lang) return;
  lang = next;
  apply();
  portfolioEvidenceLinks();
}
window.addEventListener('pageshow', portfolioEvidenceRestore);
window.addEventListener('popstate', portfolioEvidenceRestore);
lang = portfolioEvidenceLanguage();
// End portfolio display language integration.
  apply();
  portfolioEvidenceLinks();
})();
