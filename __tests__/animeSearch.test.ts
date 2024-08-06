import { expect, test } from "vitest";
import { getAnimeSearch } from "../src/index.js";

test("returns animes related to search query", async () => {
  const data = await getAnimeSearch("monster", 2, {});

  expect(data.animes).not.toEqual([]);
  expect(data.mostPopularAnimes).not.toEqual([]);
});
