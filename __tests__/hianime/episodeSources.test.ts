import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run episodeServers.test.ts
test("returns episode source servers", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getEpisodeSources("steinsgate-0-92?ep=2055");

    expect(data.sources).not.toEqual(null);
});
