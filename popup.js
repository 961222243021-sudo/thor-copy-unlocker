let host = null, tabId = null;
const $ = (id) => document.getElementById(id);

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab || !tab.url) return;
  tabId = tab.id;
  try { host = new URL(tab.url).hostname; } catch (e) {}
  $("host").textContent = host || "this page";
  if (!host) { $("toggle").disabled = true; return; }
  chrome.storage.local.get(["disabledSites"], (r) => {
    const off = (r && r.disabledSites) || [];
    setUI(!off.includes(host));
  });
});

function setUI(on) {
  $("toggle").checked = on;
  $("status").textContent = on ? "POWER: UNLEASHED" : "POWER: SLEEPING";
  document.body.classList.toggle("off", !on);
}

$("toggle").addEventListener("change", (e) => {
  if (!host) return;
  const on = e.target.checked;
  setUI(on);
  chrome.storage.local.get(["disabledSites"], (r) => {
    let off = (r && r.disabledSites) || [];
    off = on ? off.filter((h) => h !== host) : (off.includes(host) ? off : [...off, host]);
    chrome.storage.local.set({ disabledSites: off });
  });
});

$("reload").addEventListener("click", () => {
  if (tabId != null) { chrome.tabs.reload(tabId); window.close(); }
});

$("record").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("recorder.html") });
  window.close();
});
