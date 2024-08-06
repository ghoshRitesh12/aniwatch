import { expect, test } from "vitest";
import { getAnimeEpisodeSources } from "../src/index.js";

test("returns anime episode streaming link(s)", async () => {
  const data = await getAnimeEpisodeSources(
    "steinsgate-3?ep=230",
    "hd-1",
    "sub"
  );

  expect(data.sources).not.toEqual([]);
  // expect(data)
});
