import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { client } from "../../config/client.js";
import { HiAnimeError } from "../error.js";
import {
    SRC_BASE_URL,
    extractAnimes,
    extractTop10Animes,
} from "../../utils/index.js";
import type { AnimeCategories } from "../types/anime.js";
import type { ScrapedAnimeCategory } from "../types/scrapers/index.js";

export async function getAnimeCategory(
    category: AnimeCategories,
    page: number
): Promise<ScrapedAnimeCategory> {
    const res: ScrapedAnimeCategory = {
        animes: [],
        genres: [],
        top10Animes: {
            today: [],
            week: [],
            month: [],
        },
        category,
        totalPages: 0,
        hasNextPage: false,
        currentPage: (Number(page) || 0) < 1 ? 1 : Number(page),
    };

    try {
        if (category.trim() === "") {
            throw new HiAnimeError(
                "invalid anime category",
                getAnimeCategory.name,
                400
            );
        }
        page = res.currentPage;

        const scrapeUrl: URL = new URL(category, SRC_BASE_URL);
        const mainPage = await client.get(`${scrapeUrl}?page=${page}`);

        const $: CheerioAPI = load(mainPage.data);

        const selector: SelectorType =
            "#main-content .tab-content .film_list-wrap .flw-item";

        const categoryNameSelector: SelectorType =
            "#main-content .block_area .block_area-header .cat-heading";
        res.category = $(categoryNameSelector)?.text()?.trim() ?? category;

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

        res.animes = extractAnimes($, selector, getAnimeCategory.name);

        if (res.animes.length === 0 && !res.hasNextPage) {
            res.totalPages = 0;
        }

        const genreSelector: SelectorType =
            "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";
        $(genreSelector).each((_, el) => {
            res.genres.push(`${$(el).text().trim()}`);
        });

        const top10AnimeSelector: SelectorType =
            '#main-sidebar .block_area-realtime [id^="top-viewed-"]';

        $(top10AnimeSelector).each((_, el) => {
            const period = $(el).attr("id")?.split("-")?.pop()?.trim();

            if (period === "day") {
                res.top10Animes.today = extractTop10Animes(
                    $,
                    period,
                    getAnimeCategory.name
                );
                return;
            }
            if (period === "week") {
                res.top10Animes.week = extractTop10Animes(
                    $,
                    period,
                    getAnimeCategory.name
                );
                return;
            }
            if (period === "month") {
                res.top10Animes.month = extractTop10Animes(
                    $,
                    period,
                    getAnimeCategory.name
                );
            }
        });

        return res;
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getAnimeCategory.name);
    }
}
