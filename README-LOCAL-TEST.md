# Birthday Surprise — local preview

This is a static website. It keeps the existing photos and the original `song.mp3`; no generated background music or external audio tracks are included.

## Run on Windows (PowerShell)

1. Extract `birthday-surprise-dreamy-upgrade.zip`.
2. Open the extracted `birthday-surprise-dreamy-upgrade` folder in VS Code.
3. Open **Terminal → New Terminal** and run:

   ```powershell
   python -m http.server 5500
   ```

4. Open `http://localhost:5500` in your browser. If you use the parent folder as the terminal location, open `http://localhost:5500/birthday-surprise-dreamy-upgrade/` instead.
5. The birthday countdown is set to **21 October 2026**. Use **Test Mode (Skip Countdown)** to preview the surprise before then.
6. Tap **Open your letter**, tap stars in the constellation, and use **One last wish for you** at the end. Press the music button to start/pause the existing `song.mp3` if your browser blocks autoplay.
7. Stop the local server with `Ctrl+C` in the terminal.

## Cloudflare Pages / Workers static upload

Upload the extracted website contents so `index.html`, `script.js`, `styles.css`, `song.mp3`, and `assets/` are at the deployment root. Do not upload the ZIP itself as the website root. This package does not change your existing Cloudflare project or deployment.
