import { expect, test } from "vitest";
import { scrapeAnimeSearch } from "../src/scrapers/index.js";

test("returns animes related to search query", async () => {
  const data = await scrapeAnimeSearch("monster", 2, {});

  expect(data.animes).not.toEqual([]);
  expect(data.mostPopularAnimes).not.toEqual([]);
});
