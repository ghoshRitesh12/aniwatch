import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run episodeServers.test.ts
test("returns episode source servers", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getEpisodeServers("steinsgate-0-92?ep=2055");

    expect(data.episodeId).not.toEqual(null);
    expect(data.episodeNo).not.toEqual(0);
    expect(data.sub).not.toEqual([]);
    expect(data.dub).not.toEqual([]);
});
