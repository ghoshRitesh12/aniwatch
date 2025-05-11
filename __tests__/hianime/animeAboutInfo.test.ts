import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run animeAboutInfo.test.ts
test("returns information about an anime", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getInfo("steinsgate-3");

    expect(data.anime.info.name).not.toEqual(null);
    expect(data.recommendedAnimes).not.toEqual([]);
    expect(data.mostPopularAnimes).not.toEqual([]);
    expect(Object.keys(data.anime.moreInfo)).not.toEqual([]);
});
