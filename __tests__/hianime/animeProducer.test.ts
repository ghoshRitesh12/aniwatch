import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run animeProducer.test.ts
test("returns animes produced by a producer", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getProducerAnimes("toei-animation", 2);

    expect(data.animes).not.toEqual([]);
    expect(data.topAiringAnimes).not.toEqual([]);
    expect(data.top10Animes.today).not.toEqual([]);
    expect(data.top10Animes.week).not.toEqual([]);
    expect(data.top10Animes.month).not.toEqual([]);
});
