import { expect, test } from "vitest";
import { getAnimeCategory } from "../src/index.js";

test("returns animes belonging to a category", async () => {
  const data = await getAnimeCategory("subbed-anime");

  expect(data.animes).not.toEqual([]);
  expect(data.genres).not.toEqual([]);
  expect(data.top10Animes.today).not.toEqual([]);
  expect(data.top10Animes.week).not.toEqual([]);
  expect(data.top10Animes.month).not.toEqual([]);
});
