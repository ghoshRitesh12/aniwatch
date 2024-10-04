import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

test("returns animes search suggestions related to search query", async () => {
  const hianime = new HiAnime();
  const data = await hianime.searchSuggestions("one piece");

  expect(data.suggestions).not.toEqual([]);
});
