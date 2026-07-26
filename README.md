# Ziyan Wang / ryanbibi Digital Garden

A static personal website built with React, Tailwind CSS, Framer Motion, and Lucide icons.

The site is organized as a digital garden with seven main anchors:

- `#/home`: landing page
- `#/portfolio`: professional journey and projects
- `#/lab`: interactive creative experiments
- `#/github`: curated repositories, build stories, and links into the interactive Lab
- `#/vault`: percentage-based wealth dashboard, DCA routine, and Chase report import slot
- `#/vault/term-deposit`: term deposit detail page
- `#/vault/savings`: savings detail page
- `#/vault/virtual`: virtual accounts detail page
- `#/vault/stocks`: stocks detail page
- `#/life`: health, outdoors, gaming IDs, music, and restaurant coordinate cards
- `#/food`: global food atlas with a flat world map, continent / region drill-down, city pins, and ryanbibi choice notes

Both the React app and `standalone.html` include an English / Chinese language toggle, with the selected language saved in local storage.

## Data Slots

- Spotify profile: `Ryanbib1`
- Spotify URL: `https://open.spotify.com/user/31unqz7dwbqpiwmiyorxhp22sk3y`
- Game IDs live in the Life page data.
- Restaurant pins and ryanbibi choice notes live in `src/data/restaurants.json`.
- LinkedIn-synced experience, education, and contact details live in `src/data/profile.js`.
- The homepage GitHub feature lives in `src/data/githubFeatured.js`; the full curated archive lives in `src/data/githubShowcase.js`.
- Restaurant cards with a `visitedAt` date from the last 30 days automatically appear in the recent tasting log. When no current dates exist, the module shows the newest dated archive entries without labeling them as current.
- Chase holdings report placeholder lives in the Vault page data.

## Local Development

To open immediately without any server, double-click:

```text
standalone.html
```

The root `index.html` also redirects to `standalone.html` when opened directly from Finder.

For the React development version:

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build:standalone
```

The deployable static files are generated in `dist/`, and the root `standalone.html` is rebuilt from the same source. When the domain/server is ready, upload the contents of `dist/` to the static hosting root.

## Checks

```bash
npm run lint
npm run build
```
