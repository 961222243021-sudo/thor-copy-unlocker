# ⚡ Thor – Copy & Paste Unlocker

A browser extension that helps restore text selection, copy, cut, paste, and right-click actions on webpages that restrict them. Thor also includes a user-initiated screen recorder.

> **Use responsibly:** Only use this extension on content you are authorized to access. Respect website terms, copyright, privacy, and any applicable laws. The extension may not work on every website or browser page.

## ✨ Features

- **Copy & paste controls:** Helps restore text selection and copy, cut, paste, right-click, and drag-selection interactions on supported pages.
- **Per-site toggle:** Enable or disable Thor for the current website using the popup.
- **Reload shortcut:** Reload the current tab from the extension popup.
- **Screen recorder:** Start a browser-supported screen, window, or tab recording from the recorder page. The browser displays its own sharing picker.
- **Preview and export:** Preview a recording and download it. Recorder capabilities depend on browser support and the permissions you choose in the browser's sharing dialog.
- **Simple popup:** A compact interface to manage the current site's setting.

## 📦 Installation

### Firefox Add-ons

When the extension is published, add the official Mozilla Add-ons listing link here.

### Firefox (temporary/local testing)

1. Download or clone this repository.
2. Open Firefox and navigate to `about:debugging`.
3. Select **This Firefox**.
4. Click **Load Temporary Add-on…**.
5. Select the repository's `manifest.json` file.
6. Test the extension on a normal webpage.

Temporary add-ons are removed when Firefox restarts. For permanent use, install the published add-on when available.

### Chrome, Edge, or Brave (developer testing)

The manifest currently includes Firefox-specific metadata. To test in Chromium-based browsers, first verify the manifest and APIs are compatible with your target browser.

1. Download or clone the repository.
2. Open the browser's extension management page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Turn on **Developer mode**.
4. Choose **Load unpacked** and select the project folder.

Do not upload a Firefox-specific build to another browser store without testing and preparing the appropriate package.

## 🛠️ Development

### Repository structure

```text
thor-copy-unlocker/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── main-world.js
├── recorder.html
├── recorder.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md
├── LICENSE
├── PRIVACY.md
├── CONTRIBUTING.md
├── SECURITY.md
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    └── PULL_REQUEST_TEMPLATE.md
```

### Main components

- `manifest.json` — extension metadata, permissions, scripts, icons, and Firefox-specific settings.
- `popup.html` / `popup.js` — popup interface and current-site toggle.
- `content.js` — applies text-selection styling, removes selected inline event handlers, and reacts to the saved per-site setting.
- `main-world.js` — wraps `preventDefault()` for selected page events and keyboard shortcuts while Thor is enabled.
- `recorder.html` / `recorder.js` — screen-recording interface and recording logic.
- `icons/` — extension icons in supported sizes.

### Local testing checklist

- [ ] Load the extension in the target browser.
- [ ] Check the popup on a regular webpage.
- [ ] Toggle Thor off and on for a site.
- [ ] Reload the page and confirm the setting persists.
- [ ] Test text selection and copy/paste on pages where you have permission.
- [ ] Open the recorder and test the browser's screen-sharing prompt.
- [ ] Confirm recording preview and download work.
- [ ] Check the browser console for errors.
- [ ] Test restricted pages separately; browsers do not allow extensions to run on every internal or protected page.

## 🔐 Permissions and privacy

Thor requests access to webpages so its content scripts can adjust selected text-interaction restrictions. It uses browser local storage to remember which sites have Thor disabled.

- The manifest requests the `storage` permission.
- The manifest declares access to all URLs (`<all_urls>`) so scripts can operate on matching webpages.
- Screen recording starts only when the user selects the recorder control and grants access through the browser's screen-sharing picker.
- The project is intended to process extension settings and recordings locally. Review the source code before installing, and do not use the extension on sensitive pages if you are unsure about its behavior.

See [PRIVACY.md](PRIVACY.md) for more details.

## ⚠️ Limitations

- Some pages, browser-internal pages, protected content, and embedded frames may not allow extensions to change their behavior.
- Websites may use mechanisms that this extension does not handle.
- Screen-recording options vary by browser and operating system. The browser may require the user to select a screen, window, or tab each time.
- This extension does not guarantee that every copy/paste restriction can be bypassed.
- Always follow applicable website rules and respect copyrighted or confidential content.

## 🤝 Contributing

Bug reports, ideas, and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

## 📄 License

This project is distributed under the MIT License. See [LICENSE](LICENSE).

## 👤 Author

Created by **Shyam**.

If you publish a release or official store listing, add its link here.
