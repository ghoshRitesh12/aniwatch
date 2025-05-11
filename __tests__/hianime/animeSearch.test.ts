import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run animeSearch.test.ts
test("returns animes related to search query", async () => {
    const hianime = new HiAnime.Scraper();

    const data = await hianime.search("monster", 1, {
        genres: "seinen,psychological",
    });

    expect(data.animes).not.toEqual([]);
    expect(data.mostPopularAnimes).not.toEqual([]);
});
