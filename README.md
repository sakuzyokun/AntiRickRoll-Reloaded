# AntiRickRoll Reloaded

> Never gonna rickroll you, never gonna let you get rickrolled.

AntiRickRoll Reloaded is a modernized fork of
[AntiRickRoll](https://github.com/dnorhoj/AntiRickRoll).

It detects known RickRoll links and blocks them before you get sent
to the video.

## Features

- 🚫 Blocks known RickRoll links
- 🎬 YouTube URL detection
- 🌐 Remote RickRoll database
- ⚡ Lightweight version check
- 📊 RickRoll blocking statistics
- 🌍 Japanese / English UI
- 🔧 Enable / disable protection
- 🧩 Manifest V3
- 💾 Local database caching

## How it works

The extension checks a tiny version file when a page is opened:

```text
https://sakuzyo.net/antirickroll/version.json
```

If the local database is outdated, the extension downloads the latest
RickRoll database:

```text
https://sakuzyo.net/antirickroll/links.json
```

The database is stored locally using `chrome.storage.local`.

The remote database contains data only. It does not contain executable
code.

## Installation

### Chromium-based browsers

The extension is distributed as a pre-built ZIP package.

1. Download the latest release.
2. Extract the ZIP file.
3. Open your browser's extension management page.
4. Enable Developer Mode.
5. Select **Load unpacked**.
6. Select the extracted extension directory.

### Building from source

Requirements:

- Node.js 24
- npm

1. Clone or download this repository.
2. Install the dependencies:

```bash
npm ci
```

3. Build the extension:

```bash
npm run build
```

The built extension will be generated in:

```text
dist/
```

4. Open your browser's extension management page.
5. Enable Developer Mode.
6. Select **Load unpacked**.
7. Select the `dist` directory.

## Project structure

```text
src/
├── background/
│   ├── content.js
│   └── service-worker.js
├── icons/
├── popup/
│   ├── App.svelte
│   ├── pages/
│   └── lib/
├── warn/
└── manifest-v3.json
```

## Database

The RickRoll database is maintained separately from the extension.

### Version

```json
{"v":1}
```

### Rules

Example:

```json
{
  "rules": [
    {
      "type": "youtube",
      "id": "dQw4w9WgXcQ"
    }
  ]
}
```

More rule types may be added in future versions.

## Browser support

AntiRickRoll Reloaded currently targets Chromium-based browsers
with Manifest V3 support.

Firefox support is currently experimental / not guaranteed.

## Community & Contributing

Found a RickRoll that isn't being blocked?

Please report it on GitHub:

👉 [Report a RickRoll](https://github.com/sakuzyokun/AntiRickRoll-Reloaded/issues/new)

Want to add a rule yourself?

👉 [Submit a Pull Request](https://github.com/sakuzyokun/AntiRickRoll-Reloaded/compare)

Pull requests and issue reports are welcome!

## Credits

This project is a modernized fork of
[AntiRickRoll by dnorhoj](https://github.com/dnorhoj/AntiRickRoll).

The original project is licensed under the GNU General Public License
version 3.0.

## License

GNU General Public License v3.0.

See [`LICENSE`](LICENSE) for the full license text.

Never gonna give RickRoll up. 😎
