import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";
// import { HiAnime } from "../../dist/index.js";

// npx vitest run animeEpisodeSrcs.test.ts
[
  // "attack-on-titan-112?ep=3304",
  // "attack-on-titan-112?ep=3303",
  // "dandadan-19319?ep=130044",
  // "one-piece-100?ep=2142",
  // "steinsgate-3?ep=220",
  // "monster-37?ep=1046",
  "sword-art-online-alternative-gun-gale-online-ii-19325?ep=130746",
].map((animeEpisodeId) => {
  test(`returns ${animeEpisodeId} anime episode streaming link(s)`, async () => {
    const hianime = new HiAnime.Scraper();

    const data = await hianime.getEpisodeSources(
      // "steinsgate-3?ep=230",
      // "haikyu-movie-battle-of-the-garbage-dump-18922?ep=128840",
      // "attack-on-titan-112?ep=3304",
      animeEpisodeId,
      "hd-1",
      "raw"
    );

    console.log(data);
    expect(data.sources).not.toEqual([]);
    // expect(data)
  });
});
