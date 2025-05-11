import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run animeGenre.test.ts
test("returns animes belonging to a genre", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getGenreAnime("shounen", 2);

    expect(data.animes).not.toEqual([]);
    expect(data.genres).not.toEqual([]);
    expect(data.topAiringAnimes).not.toEqual([]);
});
