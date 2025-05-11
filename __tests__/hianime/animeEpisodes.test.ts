import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run animeEpisodes.test.ts
test("returns episodes info of an anime", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getEpisodes("steinsgate-3");

    expect(data.totalEpisodes).not.toEqual(0);
    expect(data.episodes).not.toEqual([]);
});
