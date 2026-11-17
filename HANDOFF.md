# UNESCO Dakar redesign pitch

Static site, no build step. Serve the folder (e.g. `python3 -m http.server 4417`) and open `index.html`.

- `index.html` homepage redesign V1, editorial (content from unesco.org/en/fieldoffice/dakar, archived 27 Sep 2026)
- `V2/index.html` homepage V2, "elegant x SaaS": Instrument Serif (upright) + Geist from Google Fonts, rounded cards, country explorer tabs, filterable stories/news, video playlist. Uses the shared `assets/` folder. References from Mobbin (MaxiBestOf quota was exhausted until 1 Dec 2026).
- `brand.html` brand guide answering the tender scope: logo vectorisation/normalisation, brand guide, digital/audiovisual assets, institutional templates; print/signage shown as a separate lot
- `credits.html` image credits
- `assets/css/site.css` shared design system, `assets/css/brand.css` guide-only styles, `assets/js/site.js` nav, mega menu, GSAP/Lenis motion
- Fonts: Maison Neue (Book/Medium/Demi/Bold, from the studio's licence). Check web licensing before going live.
- Logo: official UNESCO SVGs (blue + white) taken untouched from unesco.org. The office lockup sets "Regional Office for West Africa, Dakar" beside it as a proposal.

Imagery: hero and card images are UNESCO's own (© UNESCO / Layepro etc.). Supplementary photos are CC-licensed from Wikimedia Commons (see `assets/img/wm/credits.json`); some story/news pairings are illustrative placeholders, not the original article images.

Not done: subpages (About, Expertise, Impact, country pages), French version, real download files.
