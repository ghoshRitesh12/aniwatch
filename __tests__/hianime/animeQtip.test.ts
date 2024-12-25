import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

const animeId = "one-piece-100";

// npx vitest run animeQtip.test.ts
test(`returns ${animeId} anime qtip info`, async () => {
  const hianime = new HiAnime.Scraper();
  const data = await hianime.getQtipInfo(animeId);

  expect(data.id).not.toEqual(null);
  expect(data.name).not.toEqual(null);
  expect(data.description).not.toEqual(null);
  expect(data.genres).not.toEqual([]);
});
