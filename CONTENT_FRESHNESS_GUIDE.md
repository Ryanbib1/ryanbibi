# Content Freshness Guide

The homepage update stream is generated from three sources:

- `src/data/restaurants.json`: latest entries by `addedAt`.
- `src/data/projectProgress.js`: shipped and active project milestones.
- `src/data/siteUpdates.js`: editorial and structural site changes.

`npm run activity:generate` merges these sources into `src/data/activityFeed.json`, sorts them by date, and selects the latest restaurant, project milestone, site update, and overall update date.

Every production build regenerates the feed. A successful `food:import --write` also validates the restaurant archive and refreshes the homepage feed automatically.

When recording project progress, add a dated entry to `projectProgress.js` with bilingual title and detail, status, progress percentage, and destination link.
