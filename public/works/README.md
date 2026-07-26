# Embedded works

Each subfolder here is one standalone work, loaded by the site in a full-bleed
`<iframe>` (see `src/projects/registry.js` → entries with `type: 'embed'`).
The iframe is its own document, so a work can use **any tech stack** (vanilla,
p5.js, three.js, its own bundler) without its JS/CSS/globals touching the
ink-wash site.

## Add or update a work

1. Build your work into static files (it must have an `index.html` entry).
2. Drop the build output into `public/works/<slug>/`, replacing the placeholder.
   - `<slug>` must match the `slug` in `src/projects/registry.js`.
   - Use **relative** asset paths in your `index.html` (e.g. `./app.js`,
     `./assets/x.png`) so it resolves correctly under `/works/<slug>/`.
3. Make sure the entry in `registry.js` has `type: 'embed'`,
   `embed: '/works/<slug>/'`, and `status: 'live'`.

That's it — the card on `/work` links straight into it.

## Current slots

| slug      | work         | status      |
| --------- | ------------ | ----------- |
| `arcade`   | 赛博街机 | live | four Canvas game loops with desktop and touch controls |
| `xuan`     | 玄       | live | standalone generative ink experience |
| `sheng`    | 声       | live | standalone audio-reactive visualizer |
| `liuguang` | 流光     | live | standalone flowing-light Canvas experience |
