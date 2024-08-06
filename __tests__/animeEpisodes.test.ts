import { expect, test } from "vitest";
import { getAnimeEpisodes } from "../src/index.js";

test("returns episodes info of an anime", async () => {
  const data = await getAnimeEpisodes("steinsgate-3");

  expect(data.totalEpisodes).not.toEqual(0);
  expect(data.episodes).not.toEqual([]);
});
