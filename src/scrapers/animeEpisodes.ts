import { client } from "../config/client.js";
import { AniwatchError } from "../config/error.js";
import { SRC_BASE_URL, SRC_AJAX_URL } from "../utils/index.js";
import { load, type CheerioAPI } from "cheerio";
import type { ScrapedAnimeEpisodes } from "../types/scrapers/index.js";

export async function getAnimeEpisodes(
  animeId: string
): Promise<ScrapedAnimeEpisodes> {
  const res: ScrapedAnimeEpisodes = {
    totalEpisodes: 0,
    episodes: [],
  };

  try {
    if (animeId.trim() === "") {
      throw new AniwatchError("Anime Id required", getAnimeEpisodes.name);
    }

    const episodesAjax = await client.get(
      `${SRC_AJAX_URL}/v2/episode/list/${animeId.split("-").pop()}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${SRC_BASE_URL}/watch/${animeId}`,
        },
      }
    );

    const $: CheerioAPI = load(episodesAjax.data.html);

    res.totalEpisodes = Number($(".detail-infor-content .ss-list a").length);

    $(".detail-infor-content .ss-list a").each((_, el) => {
      res.episodes.push({
        title: $(el)?.attr("title")?.trim() || null,
        episodeId: $(el)?.attr("href")?.split("/")?.pop() || null,
        number: Number($(el).attr("data-number")),
        isFiller: $(el).hasClass("ssl-item-filler"),
      });
    });

    return res;
  } catch (err: any) {
    throw AniwatchError.wrapError(err, getAnimeEpisodes.name);
  }
}
