# HumanDesign • Minimal Universe (Demo)

A minimal React + Vite frontend to input birth data and generate a **demo Human Design reading**. Tailwind via CDN for zero-config styling.

> ⚠️ This demo does **not** use real ephemerides. For the *standard* version (Swiss Ephemeris / JPL), wire a backend as outlined in your canvas notes.

## Quick Start

```bash
npm i
npm run dev
```

Open the printed local URL. Enter date/time/place → **Tạo bản đọc**.

## Shareable URL
The app encodes form data into query params, e.g.
```
?date=1987-02-12&time=00:15&place=Ha%20Noi
```

## Build
```bash
npm run build
npm run preview
```


## Deploy on GitHub Pages (Actions)

1. Create a new repo on GitHub (e.g. `humandesign-minimal`).
2. Locally:
   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<your-user>/humandesign-minimal.git
   git push -u origin main
   ```
3. On GitHub → *Settings* → *Pages* → **Build and deployment** = *GitHub Actions*.
4. Push once more (or trigger **Actions** → *Deploy to GitHub Pages* → *Run workflow*).
5. Your site will be available at:
   - User/org site: `https://<your-user>.github.io/`
   - Project site: `https://<your-user>.github.io/humandesign-minimal/`

> This template sets `base: './'` in `vite.config.js` so it works on project pages.
