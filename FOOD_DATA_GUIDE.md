# Food Atlas Data Guide

The source of truth is `src/data/restaurants.json`. Update it through the importer whenever possible.

## Status model

- `visited`: Ryan has visited. Add `visitedAt` when the date is known.
- `wishlist`: saved for a future visit. Do not add `visitedAt`.
- `saved`: part of the archive, but visit status has not been confirmed.

`addedAt` records when an entry joined the Atlas. It is different from `visitedAt`.

## Batch import

1. Duplicate `data-templates/restaurants-import.csv` or open it in Excel and save as `.xlsx`.
2. Run a dry import:

```bash
npm run food:import -- /absolute/path/restaurants.xlsx
```

3. Review inserted, updated, skipped, and invalid counts.
4. Write only after the dry run is clean:

```bash
npm run food:import -- /absolute/path/restaurants.xlsx --write
```

Writing an import automatically validates the archive and regenerates both the homepage Food summary and the activity feed.

Rows match an existing restaurant by `id`, or by the combination of name, region, and area. New rows receive an ID, `sourceRow`, and `addedAt` automatically.

## Choice memory import

Use `data-templates/choice-memories-import.csv`, then run:

```bash
npm run food:import -- /absolute/path/choice-memories.xlsx --memories
npm run food:import -- /absolute/path/choice-memories.xlsx --memories --write
```

Memory imports update existing restaurants only. They never create an unmatched restaurant.

## Coordinates

- `coordinateAccuracy: exact` requires a real address and source URL.
- `coordinateAccuracy: estimated` is suitable for city-level Atlas placement only.
- `coordinateAccuracy: missing` must not display an exact-location claim.

## Photos

Store local images under `public/food/<restaurant-id>/`. Separate multiple image paths with `|` in CSV/Excel. Use owned or licensed images rather than hotlinking third-party photos.
