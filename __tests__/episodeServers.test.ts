import { expect, test } from "vitest";
import { getEpisodeServers } from "../src/index.js";

test("returns episode source servers", async () => {
  const data = await getEpisodeServers("steinsgate-0-92?ep=2055");

  expect(data.episodeId).not.toEqual(null);
  expect(data.episodeNo).not.toEqual(0);
  expect(data.sub).not.toEqual([]);
  expect(data.dub).not.toEqual([]);
});
