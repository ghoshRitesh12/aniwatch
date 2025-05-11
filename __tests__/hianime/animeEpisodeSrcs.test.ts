import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

const animeEpisodeId = "attack-on-titan-112?ep=3304";

// npx vitest run animeEpisodeSrcs.test.ts
test(`returns ${animeEpisodeId} episode streaming link(s)`, async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getEpisodeSources(animeEpisodeId, "hd-1", "sub");

    expect(data.sources).not.toEqual([]);
});
