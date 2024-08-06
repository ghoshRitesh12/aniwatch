import { expect, test } from "vitest";
import { getAnimeSearchResults } from "../src/index.js";

test("returns animes related to search query", async () => {
  const data = await getAnimeSearchResults("monster", 1, {
    genres: "seinen,psychological",
  });

  expect(data.animes).not.toEqual([]);
  expect(data.mostPopularAnimes).not.toEqual([]);
});
