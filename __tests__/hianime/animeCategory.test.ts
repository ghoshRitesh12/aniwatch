import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run animeCategory.test.ts
test("returns animes belonging to a category", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getCategoryAnime("subbed-anime");

    expect(data.animes).not.toEqual([]);
    expect(data.genres).not.toEqual([]);
    expect(data.top10Animes.today).not.toEqual([]);
    expect(data.top10Animes.week).not.toEqual([]);
    expect(data.top10Animes.month).not.toEqual([]);
});
