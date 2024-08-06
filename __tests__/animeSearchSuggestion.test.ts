import { expect, test } from "vitest";
import { getAnimeSearchSuggestion } from "../src/index.js";

test("returns animes search suggestions related to search query", async () => {
  const data = await getAnimeSearchSuggestion("one piece");

  expect(data.suggestions).not.toEqual([]);
});
