import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run animeSearchSuggestion.test.ts
test("returns animes search suggestions related to search query", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.searchSuggestions("one piece");

    expect(data.suggestions).not.toEqual([]);
});
