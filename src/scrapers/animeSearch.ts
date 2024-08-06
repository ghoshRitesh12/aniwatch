import { client } from "../config/client.js";
import { AniwatchError } from "../config/error.js";
import {
  SRC_SEARCH_URL,
  extractAnimes,
  getSearchFilterValue,
  extractMostPopularAnimes,
  getSearchDateFilterValue,
} from "../utils/index.js";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import type { ScrapedAnimeSearchResult } from "../types/scrapers/index.js";
import type { SearchFilters, FilterKeys } from "../types/animeSearch.js";

// /anime/search?q=${query}&page=${page}
export async function getAnimeSearch(
  q: string,
  page: number = 1,
  filters: SearchFilters
): Promise<ScrapedAnimeSearchResult> {
  const res: ScrapedAnimeSearchResult = {
    animes: [],
    mostPopularAnimes: [],
    currentPage: Number(page),
    hasNextPage: false,
    totalPages: 1,
    searchQuery: q,
    searchFilters: filters,
  };

  try {
    const url = new URL(SRC_SEARCH_URL);
    url.searchParams.set("keyword", q);
    url.searchParams.set("page", `${page}`);
    url.searchParams.set("sort", "default");

    for (const key in filters) {
      if (key.includes("_date")) {
        const dates = getSearchDateFilterValue(
          key === "start_date",
          filters[key as keyof SearchFilters] || ""
        );
        if (!dates) continue;

        dates.map((dateParam) => {
          const [key, val] = dateParam.split("=");
          url.searchParams.set(key, val);
        });
        continue;
      }

      const filterVal = getSearchFilterValue(
        key as FilterKeys,
        filters[key as keyof SearchFilters] || ""
      );
      filterVal && url.searchParams.set(key, filterVal);
    }

    const mainPage = await client.get(url.href);

    const $: CheerioAPI = load(mainPage.data);

    const selector: SelectorType =
      "#main-content .tab-content .film_list-wrap .flw-item";

    res.hasNextPage =
      $(".pagination > li").length > 0
        ? $(".pagination li.active").length > 0
          ? $(".pagination > li").last().hasClass("active")
            ? false
            : true
          : false
        : false;

    res.totalPages =
      Number(
        $('.pagination > .page-item a[title="Last"]')
          ?.attr("href")
          ?.split("=")
          .pop() ??
          $('.pagination > .page-item a[title="Next"]')
            ?.attr("href")
            ?.split("=")
            .pop() ??
          $(".pagination > .page-item.active a")?.text()?.trim()
      ) || 1;

    res.animes = extractAnimes($, selector, getAnimeSearch.name);

    if (res.animes.length === 0 && !res.hasNextPage) {
      res.totalPages = 0;
    }

    const mostPopularSelector: SelectorType =
      "#main-sidebar .block_area.block_area_sidebar.block_area-realtime .anif-block-ul ul li";
    res.mostPopularAnimes = extractMostPopularAnimes(
      $,
      mostPopularSelector,
      getAnimeSearch.name
    );

    return res;
  } catch (err: any) {
    throw AniwatchError.wrapError(err, getAnimeSearch.name);
  }
}
