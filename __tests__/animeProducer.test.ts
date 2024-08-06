import { expect, test } from "vitest";
import { getProducerAnimes } from "../src/index.js";

test("returns animes produced by a producer", async () => {
  const data = await getProducerAnimes("toei-animation", 2);

  expect(data.animes).not.toEqual([]);
  expect(data.topAiringAnimes).not.toEqual([]);
  expect(data.top10Animes.today).not.toEqual([]);
  expect(data.top10Animes.week).not.toEqual([]);
  expect(data.top10Animes.month).not.toEqual([]);
});
