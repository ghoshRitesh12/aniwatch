import { client } from "../config/client.js";
import { AniwatchError } from "../config/error.js";
import { SRC_HOME_URL, SRC_AJAX_URL } from "../utils/index.js";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import type { ScrapedAnimeSearchSuggestion } from "../types/scrapers/index.js";

// /anime/search/suggest?q=${query}
export async function getAnimeSearchSuggestion(
  q: string
): Promise<ScrapedAnimeSearchSuggestion> {
  const res: ScrapedAnimeSearchSuggestion = {
    suggestions: [],
  };

  try {
    const { data } = await client.get(
      `${SRC_AJAX_URL}/search/suggest?keyword=${encodeURIComponent(q)}`,
      {
        headers: {
          Accept: "*/*",
          Pragma: "no-cache",
          Referer: SRC_HOME_URL,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const $: CheerioAPI = load(data.html);
    const selector: SelectorType = ".nav-item:has(.film-poster)";

    if ($(selector).length < 1) return res;

    $(selector).each((_, el) => {
      const id = $(el).attr("href")?.split("?")[0].includes("javascript")
        ? null
        : $(el).attr("href")?.split("?")[0]?.slice(1) || null;

      res.suggestions.push({
        id,
        name: $(el).find(".srp-detail .film-name")?.text()?.trim() || null,
        jname:
          $(el).find(".srp-detail .film-name")?.attr("data-jname")?.trim() ||
          $(el).find(".srp-detail .alias-name")?.text()?.trim() ||
          null,
        poster:
          $(el)
            .find(".film-poster .film-poster-img")
            ?.attr("data-src")
            ?.trim() || null,
        moreInfo: [
          ...$(el)
            .find(".film-infor")
            .contents()
            .map((_, el) => $(el).text().trim()),
        ].filter((i) => i),
      });
    });

    return res;
  } catch (err: any) {
    throw AniwatchError.wrapError(err, getAnimeSearchSuggestion.name);
  }
}
