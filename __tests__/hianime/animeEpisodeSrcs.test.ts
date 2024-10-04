import { expect, test } from "vitest";
import { HiAnime } from "../../src/index.js";

test("returns anime episode streaming link(s)", async () => {
  const hianime = new HiAnime();
  const data = await hianime.getEpisodeSources(
    "steinsgate-3?ep=230",
    "hd-1",
    "sub"
  );

  expect(data.sources).not.toEqual([]);
  // expect(data)
});
