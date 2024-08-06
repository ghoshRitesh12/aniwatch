import { expect, test } from "vitest";
import { getGenreAnime } from "../src/index.js";

test("returns animes belonging to a genre", async () => {
  const data = await getGenreAnime("shounen", 2);

  expect(data.animes).not.toEqual([]);
  expect(data.genres).not.toEqual([]);
  expect(data.topAiringAnimes).not.toEqual([]);
});
