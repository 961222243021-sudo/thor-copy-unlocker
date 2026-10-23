// Thor – isolated-world content script (made by Shyam)
(function () {
  const HOST = location.hostname;
  const STYLE_ID = "__thor-style";
  const PROPS = ["oncopy", "oncut", "onpaste", "oncontextmenu", "onselectstart", "ondragstart"];
  let enabled = true;
  let observer = null;

  const send = () => window.postMessage({ __thorControl: true, enabled }, "*");

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = "*,*::before,*::after{user-select:text!important;-webkit-user-select:text!important;-webkit-touch-callout:default!important}";
    (document.head || document.documentElement).appendChild(s);
  }

  function clearHandlers() {
    for (const t of [document, document.documentElement, document.body]) {
      if (!t) continue;
      for (const p of PROPS) {
        try { if (typeof t[p] === "function") t[p] = null; } catch (e) {}
        try { if (t.removeAttribute && t.hasAttribute && t.hasAttribute(p)) t.removeAttribute(p); } catch (e) {}
      }
    }
  }

  function start() {
    injectCSS();
    clearHandlers();
    if (observer) return;
    // Replaces the old 1s polling: react only when attributes/children change.
    observer = new MutationObserver(() => {
      if (!enabled) return;
      injectCSS();
      clearHandlers();
    });
    observer.observe(document.documentElement, {
      attributes: true, attributeFilter: PROPS, childList: true, subtree: false
    });
  }

  function stop() {
    if (observer) { observer.disconnect(); observer = null; }
    const s = document.getElementById(STYLE_ID);
    if (s) s.remove();
  }

  function apply(on) {
    enabled = on;
    send();
    if (on) {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
      start();
    } else stop();
  }

  try {
    chrome.storage.local.get(["disabledSites"], (r) => apply(!((r && r.disabledSites) || []).includes(HOST)));
  } catch (e) { apply(true); }

  window.addEventListener("DOMContentLoaded", () => { send(); if (enabled) clearHandlers(); });
  setTimeout(send, 250);

  try {
    chrome.storage.onChanged.addListener((c, area) => {
      if (area !== "local" || !c.disabledSites) return;
      apply(!(c.disabledSites.newValue || []).includes(HOST));
    });
  } catch (e) {}
})();
