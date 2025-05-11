import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { client } from "../../config/client.js";
import { HiAnimeError } from "../error.js";
import {
    SRC_BASE_URL,
    extractMostPopularAnimes,
    extractAnimes,
    extractTop10Animes,
} from "../../utils/index.js";
import type { ScrapedProducerAnime } from "../types/scrapers/index.js";

export async function getProducerAnimes(
    producerName: string,
    page: number
): Promise<ScrapedProducerAnime> {
    const res: ScrapedProducerAnime = {
        producerName,
        animes: [],
        top10Animes: {
            today: [],
            week: [],
            month: [],
        },
        topAiringAnimes: [],
        totalPages: 0,
        hasNextPage: false,
        currentPage: (Number(page) || 0) < 1 ? 1 : Number(page),
    };

    try {
        if (producerName.trim() === "") {
            throw new HiAnimeError(
                "invalid producer name",
                getProducerAnimes.name,
                400
            );
        }
        page = res.currentPage;

        const producerUrl: URL = new URL(
            `/producer/${producerName}?page=${page}`,
            SRC_BASE_URL
        );

        const mainPage = await client.get(producerUrl.href);

        const $: CheerioAPI = load(mainPage.data);

        const animeSelector: SelectorType =
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

        res.animes = extractAnimes($, animeSelector, getProducerAnimes.name);

        if (res.animes.length === 0 && !res.hasNextPage) {
            res.totalPages = 0;
        }

        const producerNameSelector: SelectorType =
            "#main-content .block_area .block_area-header .cat-heading";
        res.producerName =
            $(producerNameSelector)?.text()?.trim() ?? producerName;

        const top10AnimeSelector: SelectorType =
            '#main-sidebar .block_area-realtime [id^="top-viewed-"]';

        $(top10AnimeSelector).each((_, el) => {
            const period = $(el).attr("id")?.split("-")?.pop()?.trim();

            if (period === "day") {
                res.top10Animes.today = extractTop10Animes(
                    $,
                    period,
                    getProducerAnimes.name
                );
                return;
            }
            if (period === "week") {
                res.top10Animes.week = extractTop10Animes(
                    $,
                    period,
                    getProducerAnimes.name
                );
                return;
            }
            if (period === "month") {
                res.top10Animes.month = extractTop10Animes(
                    $,
                    period,
                    getProducerAnimes.name
                );
            }
        });

        const topAiringSelector: SelectorType =
            "#main-sidebar .block_area_sidebar:nth-child(2) .block_area-content .anif-block-ul ul li";
        res.topAiringAnimes = extractMostPopularAnimes(
            $,
            topAiringSelector,
            getProducerAnimes.name
        );

        return res;
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getProducerAnimes.name);
    }
}
