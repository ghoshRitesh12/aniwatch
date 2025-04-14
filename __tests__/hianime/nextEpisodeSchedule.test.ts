import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

// npx vitest run episodeSchedule.test.ts
test("returns anime next episode schedule", async () => {
    const hianime = new HiAnime.Scraper();

    const animeId = "one-piece-100";
    const data = await hianime.getNextEpisodeSchedule(animeId);

    expect(data.airingISOTimestamp).not.toEqual(null);
    expect(data.airingTimestamp).not.toEqual(null);
    expect(data.secondsUntilAiring).not.toEqual(null);
});
