# Aryan Maurya — Kage portfolio

A personal portfolio built with the original **KageLandingPage** from **ThreeUI 1.2.0**, React and Vite. It keeps the authored temple world, red moon, fog, leaves, foreground artwork, card effects, scroll camera and responsive navigation.

The portfolio includes your real student details, HTML/CSS/JavaScript skills, Python learning through loops, interests in web development and cybersecurity, and your GitHub and LinkedIn links. No completed projects, email address, résumé or professional experience have been invented.

## Start locally

Install Node.js 22.12 or later (Node 24 is suitable). Open a terminal in this folder:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/**. Keep the terminal running. The first scene takes a few seconds to construct. Use the menu, scroll, or the chapter buttons at the right to explore.

Do not double-click `index.html`: the component and its local scene need a web server.

## What to edit

| File | Purpose |
| --- | --- |
| `src/content.js` | Your name, introduction, skills, interests, social links and projects |
| `src/main.jsx` | The actual ThreeUI component and its typography/color props |
| `src/personalize-kage.js` | Maps your content into the original page before its animation starts |
| `src/portfolio-shell.css` | Full-window outer frame |
| `index.html` | Browser title, search description and no-JavaScript fallback |
| `public/favicon.svg` | Small browser icon |
| `scripts/prepare-kage.mjs` | Verifies original files and generates the personalized page |
| `scripts/check-kage.mjs` | Checks generated script syntax and preservation of original source |
| `.references/threeui/registered/` | Unmodified, hash-verified source supplied by ThreeUI |
| `.references/threeui/verification.json` | Original fingerprints and a record of the customization |

**Do not edit `public/landing-pages/kage.html` directly.** It is generated again before development/build and when the content adapter changes. Edit the content or adapter instead.

The older orange KODE-inspired implementation remains in `src/main.js`, `src/hero.js` and `src/styles.css` as reference. The active entry is now `src/main.jsx`; these older files are not loaded.

## Update your profile

Open `src/content.js`, change the text between quotes, and save. During `npm run dev`, the page regenerates and refreshes automatically.

- `wordmark`: the large scene lettering, currently `ARYAN`; use 2–8 uppercase letters.
- `headline`: keep three short lines so they fit the authored hero.
- `about`, `aboutDetail`: your introduction.
- `facts`: four short fact tiles.
- `interests`: three labels for the original illustrative temple cards. These are interests, not completed projects.
- `skills`: five skill/learning tiles. Keep statuses honest, such as “Build with”, “Learning” or “Interested in”.
- `links`: your GitHub and LinkedIn URLs.

Keep the facts/interests/skills arrays at 4/3/5 entries respectively unless you also update the adapter and layout. Additional project entries are supported without changing the layout.

The four small hero summaries and footer skill labels are in `src/personalize-kage.js`. Update those if your skill set changes. If you change your name or introduction, also update the metadata and fallback content in `index.html`.

## Add a real project

Replace the empty `projects: []` in `src/content.js` with entries like this. Replace all example text with your own actual work; leave unavailable URLs empty.

```js
projects: [
  {
    title: 'My project title',
    description: 'What it does, what I built, and what I learned.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/projects/my-project.webp',
    imageAlt: 'A screenshot of my project homepage',
    liveUrl: '',
    githubUrl: '',
  },
],
```

Place the screenshot at `public/projects/my-project.webp`. You can omit `image` and `imageAlt` until you have a screenshot. The empty-state message is replaced automatically when projects are added. Only populated HTTP/HTTPS links are shown. The original three scene illustrations remain above your actual projects.

Prefer compressed WebP screenshots, around 1200–1600 pixels wide. Use descriptive alternative text. Never put private credentials in a public project description or repository.

## Add email or résumé

In `links`, fill in `email` with your real address to show an Email link. To add a résumé, place a PDF at `public/resume.pdf` and set:

```js
resume: '/resume.pdf',
```

Blank values keep these links hidden. Contact currently works through your real LinkedIn and GitHub pages; there is no contact form or message-storage service.

## Change typography or color

The supplied configuration is used in `src/main.jsx`:

```jsx
<KageLandingPage
  headingFont="onest"
  bodyFont="onest"
  headingWeight="400"
  bodyWeight="300"
  primaryColor="#e0231c"
  headingSize={46}
  bodySize={17}
  headingLetterSpacing={-0.012}
  applyScene={labelPortfolio}
/>
```

ThreeUI applies these props to its local page. They control supported page typography and accents, not every color in the authored WebGL world. Advanced scene changes belong in a separate, documented transformation in `prepare-kage.mjs`; do not edit the registered original or files inside `node_modules`.

The component uses its own **local iframe** as authored by ThreeUI. It loads `/landing-pages/kage.html` from this site, not a third-party preview or documentation page. `vite.config.js` resolves the root named component import to the package’s identical per-component export, avoiding unrelated legacy shaders.

## Motion and performance

The original source reduces entrance/scroll transitions for the operating system's reduced-motion preference. Ambient WebGL effects still run; this is not a complete animation pause switch. The scene pauses its render loop when the tab is hidden and adapts its rendering resolution to performance. The original no-WebGL fallback retains readable content and navigation.

A real 3D scene uses more graphics resources than a conventional portfolio. Test on an actual phone before sharing broadly. The runtime, embedded fonts and all 14 supplied scene images are hosted locally.

## Build and verify

```sh
npm run check
npm run build
npm run preview
```

The production preview is **http://127.0.0.1:4173/**. `npm run check` verifies all 22 supplied source/asset hashes, parses the generated inline scripts, and confirms that removing the content injection and wordmark substitution restores the exact original page. `npm run build` also regenerates the scene.

Before sharing, inspect the hero and each chapter on desktop and phone, open/close the mobile menu, and check your social/project links. Keep the public assets folder with the built output.

## Publish

The generated **`dist/` folder** is the complete static website. Use `npm ci` as the install step, `npm run build` as the build command, and `dist` as the publish directory with your static host.

Host at the **root of a domain**, such as `https://your-name.example/`. The supplied ThreeUI component uses `/landing-pages/kage.html`, so it does not support a nested path such as `/portfolio/` unchanged. A GitHub Pages user site or a domain-root static host fits this structure. Do not upload `node_modules`, `.references` or the whole development folder as the public site.

No hosted URL is recorded yet. This checkout can be previewed locally and the production output is ready for hosting.

## Source provenance and licenses

- Original preview: https://threeui.com/landing-pages/kage.html
- Registered source bundle: https://threeui.com/source-code/kage-landing-page.json
- Exact original HTML SHA-256: `c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49`
- Package: `@designcodeio/threeui@1.2.0`

The original source is retained byte-for-byte under `.references/threeui/registered`. The generated public page differs only by (1) an early content adapter and (2) the wordmark text `KAGE` → `ARYAN`. The adapter changes copy/links, adds real-project rendering, and includes a small amount of portfolio-specific layout/accessibility CSS. Original shaders, geometry, rendering logic, base CSS, scene assets and paths are preserved.

Keep `public/licenses/threeui/` when distributing the site: it contains the MIT license and asset, font and third-party notices. The footer credits the ThreeUI scene. Pin the package version; an update should deliberately re-verify the source bundle rather than silently replace it.

## Troubleshooting

- **Blank scene or loading never finishes:** inspect the browser console and check that `public/landing-pages/secret-pathways-assets/` exists. Run `npm run prepare:scene` and restart the server.
- **Fingerprint mismatch:** reinstall the exact dependency versions with `npm ci`. Do not bypass the check or use a different preview revision.
- **Edits do not appear:** save the content file, wait for regeneration, and refresh. Changes to the generator itself require `npm run prepare:scene` or a server restart.
- **Page missing after deployment:** ensure you uploaded all of `dist` at the domain root, including `landing-pages` and its assets.
- **Port already in use:** close the older portfolio server first. This project uses a fixed preview address.
- **OneDrive file locks:** the development watcher uses polling on Windows to avoid the earlier file-watcher crashes.
