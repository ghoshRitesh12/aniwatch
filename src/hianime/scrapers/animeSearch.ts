import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { client } from "../../config/client.js";
import { HiAnimeError } from "../error.js";
import {
    SRC_SEARCH_URL,
    extractAnimes,
    getSearchFilterValue,
    extractMostPopularAnimes,
    getSearchDateFilterValue,
} from "../../utils/index.js";
import type { ScrapedAnimeSearchResult } from "../types/scrapers/index.js";
import type { SearchFilters, FilterKeys } from "../types/animeSearch.js";

const searchFilters: Record<string, boolean> = {
    filter: true,
    type: true,
    status: true,
    rated: true,
    score: true,
    season: true,
    language: true,
    start_date: true,
    end_date: true,
    sort: true,
    genres: true,
} as const;

async function _getAnimeSearchResults(
    q: string,
    page: number = 1,
    filters: SearchFilters
): Promise<ScrapedAnimeSearchResult> {
    try {
        const res: ScrapedAnimeSearchResult = {
            animes: [],
            mostPopularAnimes: [],
            searchQuery: q,
            searchFilters: filters,
            totalPages: 0,
            hasNextPage: false,
            currentPage: (Number(page) || 0) < 1 ? 1 : Number(page),
        };

        const url = new URL(SRC_SEARCH_URL);
        url.searchParams.set("keyword", q);
        url.searchParams.set("page", `${res.currentPage}`);
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

        res.animes = extractAnimes($, selector, getAnimeSearchResults.name);

        if (res.animes.length === 0 && !res.hasNextPage) {
            res.totalPages = 0;
        }

        const mostPopularSelector: SelectorType =
            "#main-sidebar .block_area.block_area_sidebar.block_area-realtime .anif-block-ul ul li";
        res.mostPopularAnimes = extractMostPopularAnimes(
            $,
            mostPopularSelector,
            getAnimeSearchResults.name
        );

        return res;
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getAnimeSearchResults.name);
    }
}

export async function getAnimeSearchResults(
    q: string,
    page: number,
    filters: SearchFilters
): Promise<ScrapedAnimeSearchResult> {
    try {
        q = q.trim() ? decodeURIComponent(q.trim()) : "";
        if (q.trim() === "") {
            throw new HiAnimeError(
                "invalid search query",
                getAnimeSearchResults.name,
                400
            );
        }
        page = page < 1 ? 1 : page;

        const parsedFilters: SearchFilters = {};
        for (const key in filters) {
            if (searchFilters[key]) {
                parsedFilters[key as keyof SearchFilters] =
                    filters[key as keyof SearchFilters];
            }
        }

        return _getAnimeSearchResults(q, page, parsedFilters);
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getAnimeSearchResults.name);
    }
}
