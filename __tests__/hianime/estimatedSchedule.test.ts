import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

function padZero(num: number) {
    return num < 10 ? `0${num}` : num.toString();
}

// npx vitest run episodeSchedule.test.ts
test("returns estimated schedule anime release", async () => {
    const hianime = new HiAnime.Scraper();

    const d = new Date();
    const data = await hianime.getEstimatedSchedule(
        `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`
    );

    expect(data.scheduledAnimes).not.toEqual([]);
});
