// Thor – MAIN world script (made by Shyam)
// Runs in the page's own JS realm so the page's preventDefault() calls hit our wrapper.
(function () {
  if (window.__thorInstalled) return;
  window.__thorInstalled = true;

  const BLOCKED_EVENTS = new Set(["copy", "cut", "paste", "contextmenu", "selectstart", "dragstart"]);
  const KEYS = new Set(["c", "v", "x", "a", "p"]); // Ctrl/Cmd+S left alone so web apps can still save
  let active = true;

  const orig = Event.prototype.preventDefault;
  const patched = function preventDefault() {
    if (active) {
      if (BLOCKED_EVENTS.has(this.type)) return;
      if (this.type === "keydown" && (this.ctrlKey || this.metaKey) &&
          KEYS.has((this.key || "").toLowerCase())) return;
    }
    return orig.call(this);
  };
  // Look native if a site inspects the function.
  try {
    Object.defineProperty(patched, "toString", {
      value: () => "function preventDefault() { [native code] }"
    });
  } catch (e) {}
  Event.prototype.preventDefault = patched;

  window.addEventListener("message", (e) => {
    if (e.source !== window) return;
    const d = e.data;
    if (d && d.__thorControl === true) active = !!d.enabled;
  });
})();
