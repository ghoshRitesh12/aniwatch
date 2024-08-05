import {
  SRC_HOME_URL,
  extractTop10Animes,
  extractAnimes,
  extractMostPopularAnimes,
} from "../utils/index.js";
import { AxiosError } from "axios";
import createHttpError, { type HttpError } from "http-errors";
import type { ScrapedHomePage } from "../types/scrapers/index.js";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { client } from "../config/client.js";

// /anime/home
async function scrapeHomePage(): Promise<ScrapedHomePage | HttpError> {
  const res: ScrapedHomePage = {
    spotlightAnimes: [],
    trendingAnimes: [],
    latestEpisodeAnimes: [],
    topUpcomingAnimes: [],
    top10Animes: {
      today: [],
      week: [],
      month: [],
    },
    topAiringAnimes: [],
    mostPopularAnimes: [],
    mostFavoriteAnimes: [],
    latestCompletedAnimes: [],
    genres: [],
  };

  try {
    const mainPage = await client.get(SRC_HOME_URL as string);

    const $: CheerioAPI = load(mainPage.data);

    const spotlightSelector: SelectorType =
      "#slider .swiper-wrapper .swiper-slide";

    $(spotlightSelector).each((_, el) => {
      const otherInfo = $(el)
        .find(".deslide-item-content .sc-detail .scd-item")
        .map((_, el) => $(el).text().trim())
        .get()
        .slice(0, -1);

      res.spotlightAnimes.push({
        rank:
          Number(
            $(el)
              .find(".deslide-item-content .desi-sub-text")
              ?.text()
              .trim()
              .split(" ")[0]
              .slice(1)
          ) || null,
        id: $(el)
          .find(".deslide-item-content .desi-buttons a")
          ?.last()
          ?.attr("href")
          ?.slice(1)
          ?.trim(),
        name: $(el)
          .find(".deslide-item-content .desi-head-title.dynamic-name")
          ?.text()
          .trim(),
        description: $(el)
          .find(".deslide-item-content .desi-description")
          ?.text()
          ?.split("[")
          ?.shift()
          ?.trim(),
        poster: $(el)
          .find(".deslide-cover .deslide-cover-img .film-poster-img")
          ?.attr("data-src")
          ?.trim(),
        jname: $(el)
          .find(".deslide-item-content .desi-head-title.dynamic-name")
          ?.attr("data-jname")
          ?.trim(),
        episodes: {
          sub:
            Number(
              $(el)
                .find(
                  ".deslide-item-content .sc-detail .scd-item .tick-item.tick-sub"
                )
                ?.text()
                ?.trim()
            ) || null,
          dub:
            Number(
              $(el)
                .find(
                  ".deslide-item-content .sc-detail .scd-item .tick-item.tick-dub"
                )
                ?.text()
                ?.trim()
            ) || null,
        },
        otherInfo,
      });
    });

    const trendingSelector: SelectorType =
      "#trending-home .swiper-wrapper .swiper-slide";

    $(trendingSelector).each((_, el) => {
      res.trendingAnimes.push({
        rank: parseInt(
          $(el).find(".item .number")?.children()?.first()?.text()?.trim()
        ),
        id: $(el).find(".item .film-poster")?.attr("href")?.slice(1)?.trim(),
        name: $(el)
          .find(".item .number .film-title.dynamic-name")
          ?.text()
          ?.trim(),
        jname: $(el)
          .find(".item .number .film-title.dynamic-name")
          ?.attr("data-jname")
          ?.trim(),
        poster: $(el)
          .find(".item .film-poster .film-poster-img")
          ?.attr("data-src")
          ?.trim(),
      });
    });

    const latestEpisodeSelector: SelectorType =
      "#main-content .block_area_home:nth-of-type(1) .tab-content .film_list-wrap .flw-item";
    res.latestEpisodeAnimes = extractAnimes($, latestEpisodeSelector);

    const topUpcomingSelector: SelectorType =
      "#main-content .block_area_home:nth-of-type(3) .tab-content .film_list-wrap .flw-item";
    res.topUpcomingAnimes = extractAnimes($, topUpcomingSelector);

    const genreSelector: SelectorType =
      "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";
    $(genreSelector).each((_, el) => {
      res.genres.push(`${$(el).text().trim()}`);
    });

    const mostViewedSelector: SelectorType =
      '#main-sidebar .block_area-realtime [id^="top-viewed-"]';
    $(mostViewedSelector).each((_, el) => {
      const period = $(el).attr("id")?.split("-")?.pop()?.trim();

      if (period === "day") {
        res.top10Animes.today = extractTop10Animes($, period);
        return;
      }
      if (period === "week") {
        res.top10Animes.week = extractTop10Animes($, period);
        return;
      }
      if (period === "month") {
        res.top10Animes.month = extractTop10Animes($, period);
      }
    });

    res.topAiringAnimes = extractMostPopularAnimes(
      $,
      "#anime-featured .row div:nth-of-type(1) .anif-block-ul ul li"
    );
    res.mostPopularAnimes = extractMostPopularAnimes(
      $,
      "#anime-featured .row div:nth-of-type(2) .anif-block-ul ul li"
    );
    res.mostFavoriteAnimes = extractMostPopularAnimes(
      $,
      "#anime-featured .row div:nth-of-type(3) .anif-block-ul ul li"
    );
    res.latestCompletedAnimes = extractMostPopularAnimes(
      $,
      "#anime-featured .row div:nth-of-type(4) .anif-block-ul ul li"
    );

    return res;
  } catch (err: any) {
    if (err instanceof AxiosError) {
      throw createHttpError(
        err?.response?.status || 500,
        err?.response?.statusText || "Something went wrong"
      );
    }
    throw createHttpError.InternalServerError(err?.message);
  }
}

export default scrapeHomePage;
