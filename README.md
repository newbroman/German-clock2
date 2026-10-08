# Say the Time in German

An interactive analogue clock that shows how to say the time in German, with phonetics, English and audio.

**Live app:** https://newbroman.github.io/German-clock2/

## Features

- Analogue clock with hour, minute and optional second hands. Drag the hands to set a time, or type a time (for example 14:20) into the digital box.
- Shows the German phrase, a phonetic rendering and the English equivalent.
- Two modes:
  - Casual: 12-hour spoken style ("zehn nach drei", "halb vier", "fünf vor vier", with "Mitternacht" and "Mittag" for midnight and noon).
  - Formal: 24-hour style ("Es ist vierzehn Uhr zwanzig").
- Hours, minutes and seconds are colour coded in the German phrase.
- Buttons: Actual Time (follows the real clock), Random Time, Sec on/off (adds seconds to the phrase), Phon (show/hide phonetics), and EN/DE for the interface language.
- Quiz mode: hides the answer and offers multiple-choice phrases, with a Reveal button.
- Listen at normal speed or half speed, using the browser's German speech synthesis.
- Bilingual help pages (English and German) covering the controls, formal and casual time, times of day and a number reference for 0 to 23.
- Follows the system light/dark setting.

## Using it

Open the live app in a modern browser. On a phone or tablet, use the browser's "Add to Home Screen" or install option to install it as a PWA; it has a manifest and a service worker that caches the app files, so it works offline after the first visit.

Audio uses the Web Speech API with the `de-DE` language. For proper German pronunciation the device needs a German voice installed.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Page markup: clock, controls, display area, help pop-up |
| `script.js` | All app logic: time-to-German conversion, phonetics, clock dragging, quiz, speech, service worker registration |
| `style.css` | Styling, including the dark theme |
| `help_en.html`, `help_de.html` | Help content fetched into the pop-up |
| `manifest.json`, `icon.png` | PWA manifest and app icon |
| `sw.js` | Service worker that caches the app files for offline use |

## Development

There is no build step. Serve the folder with a static server and open the page:

```
python3 -m http.server
```

then open http://localhost:8000.

The service worker uses a versioned cache (`CACHE_NAME` in `sw.js`, currently `german-clock-v105`, mirrored by `APP_VERSION` in `script.js`). Bump both whenever you change any cached file, otherwise returning visitors keep the old copy.

## Notes

- The manifest, the service worker asset list and the registration call in `script.js` all use the hard-coded `/German-clock2/` path, so the service worker only registers correctly when served from that path (as on GitHub Pages). When testing locally at the server root it will fail to register; the app itself still runs.
- This is the current German time trainer, replacing the earlier German-Clock repository.

Built by Martin Hollingham.
