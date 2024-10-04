import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

test("returns animes belonging to a genre", async () => {
  const hianime = new HiAnime();
  const data = await hianime.getGenreAnime("shounen", 2);

  expect(data.animes).not.toEqual([]);
  expect(data.genres).not.toEqual([]);
  expect(data.topAiringAnimes).not.toEqual([]);
});
