import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run homePage.test.ts
test("returns anime information present in homepage", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getHomePage();

    expect(data.spotlightAnimes).not.toEqual([]);
    expect(data.trendingAnimes).not.toEqual([]);
    expect(data.latestEpisodeAnimes).not.toEqual([]);
    expect(data.topUpcomingAnimes).not.toEqual([]);
    expect(data.topAiringAnimes).not.toEqual([]);
    expect(data.mostPopularAnimes).not.toEqual([]);
    expect(data.mostFavoriteAnimes).not.toEqual([]);
    expect(data.latestCompletedAnimes).not.toEqual([]);
    expect(data.genres).not.toEqual([]);

    expect(data.top10Animes.today).not.toEqual([]);
    expect(data.top10Animes.week).not.toEqual([]);
    expect(data.top10Animes.month).not.toEqual([]);
});
