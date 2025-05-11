import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { client } from "../../config/client.js";
import { HiAnimeError } from "../error.js";
import {
    SRC_BASE_URL,
    extractAnimes,
    extractMostPopularAnimes,
} from "../../utils/index.js";
import type { ScrapedAnimeAboutInfo } from "../types/scrapers/index.js";

export async function getAnimeAboutInfo(
    animeId: string
): Promise<ScrapedAnimeAboutInfo> {
    const res: ScrapedAnimeAboutInfo = {
        anime: {
            info: {
                id: null,
                anilistId: null,
                malId: null,
                name: null,
                poster: null,
                description: null,
                stats: {
                    rating: null,
                    quality: null,
                    episodes: {
                        sub: null,
                        dub: null,
                    },
                    type: null,
                    duration: null,
                },
                promotionalVideos: [],
                charactersVoiceActors: [],
            },
            moreInfo: {},
        },
        seasons: [],
        mostPopularAnimes: [],
        relatedAnimes: [],
        recommendedAnimes: [],
    };

    try {
        if (animeId.trim() === "" || animeId.indexOf("-") === -1) {
            throw new HiAnimeError(
                "invalid anime id",
                getAnimeAboutInfo.name,
                400
            );
        }

        const animeUrl: URL = new URL(animeId, SRC_BASE_URL);
        const mainPage = await client.get(animeUrl.href);

        const $: CheerioAPI = load(mainPage.data);

        try {
            res.anime.info.anilistId = Number(
                JSON.parse($("body")?.find("#syncData")?.text())?.anilist_id
            );
            res.anime.info.malId = Number(
                JSON.parse($("body")?.find("#syncData")?.text())?.mal_id
            );
        } catch (err) {
            res.anime.info.anilistId = null;
            res.anime.info.malId = null;
        }

        const selector: SelectorType = "#ani_detail .container .anis-content";

        res.anime.info.id =
            $(selector)
                ?.find(".anisc-detail .film-buttons a.btn-play")
                ?.attr("href")
                ?.split("/")
                ?.pop() || null;
        res.anime.info.name =
            $(selector)
                ?.find(".anisc-detail .film-name.dynamic-name")
                ?.text()
                ?.trim() || null;
        res.anime.info.description =
            $(selector)
                ?.find(".anisc-detail .film-description .text")
                .text()
                ?.split("[")
                ?.shift()
                ?.trim() || null;
        res.anime.info.poster =
            $(selector)
                ?.find(".film-poster .film-poster-img")
                ?.attr("src")
                ?.trim() || null;

        // stats
        res.anime.info.stats.rating =
            $(`${selector} .film-stats .tick .tick-pg`)?.text()?.trim() || null;
        res.anime.info.stats.quality =
            $(`${selector} .film-stats .tick .tick-quality`)?.text()?.trim() ||
            null;
        res.anime.info.stats.episodes = {
            sub:
                Number(
                    $(`${selector} .film-stats .tick .tick-sub`)?.text()?.trim()
                ) || null,
            dub:
                Number(
                    $(`${selector} .film-stats .tick .tick-dub`)?.text()?.trim()
                ) || null,
        };
        res.anime.info.stats.type =
            $(`${selector} .film-stats .tick`)
                ?.text()
                ?.trim()
                ?.replace(/[\s\n]+/g, " ")
                ?.split(" ")
                ?.at(-2) || null;
        res.anime.info.stats.duration =
            $(`${selector} .film-stats .tick`)
                ?.text()
                ?.trim()
                ?.replace(/[\s\n]+/g, " ")
                ?.split(" ")
                ?.pop() || null;

        // get promotional videos
        $(
            ".block_area.block_area-promotions .block_area-promotions-list .screen-items .item"
        ).each((_, el) => {
            res.anime.info.promotionalVideos.push({
                title: $(el).attr("data-title"),
                source: $(el).attr("data-src"),
                thumbnail: $(el).find("img").attr("src"),
            });
        });

        // get characters and voice actors
        $(
            ".block_area.block_area-actors .block-actors-content .bac-list-wrap .bac-item"
        ).each((_, el) => {
            res.anime.info.charactersVoiceActors.push({
                character: {
                    id:
                        $(el)
                            .find($(".per-info.ltr .pi-avatar"))
                            .attr("href")
                            ?.split("/")[2] || "",
                    poster:
                        $(el)
                            .find($(".per-info.ltr .pi-avatar img"))
                            .attr("data-src") || "",
                    name: $(el).find($(".per-info.ltr .pi-detail a")).text(),
                    cast: $(el)
                        .find($(".per-info.ltr .pi-detail .pi-cast"))
                        .text(),
                },
                voiceActor: {
                    id:
                        $(el)
                            .find($(".per-info.rtl .pi-avatar"))
                            .attr("href")
                            ?.split("/")[2] || "",
                    poster:
                        $(el)
                            .find($(".per-info.rtl .pi-avatar img"))
                            .attr("data-src") || "",
                    name: $(el).find($(".per-info.rtl .pi-detail a")).text(),
                    cast: $(el)
                        .find($(".per-info.rtl .pi-detail .pi-cast"))
                        .text(),
                },
            });
        });

        // more information
        $(`${selector} .anisc-info-wrap .anisc-info .item:not(.w-hide)`).each(
            (_, el) => {
                let key = $(el)
                    .find(".item-head")
                    .text()
                    .toLowerCase()
                    .replace(":", "")
                    .trim();
                key = key.includes(" ") ? key.replace(" ", "") : key;

                const value = [
                    ...$(el)
                        .find("*:not(.item-head)")
                        .map((_, el) => $(el).text().trim()),
                ]
                    .map((i) => `${i}`)
                    .toString()
                    .trim();

                if (key === "genres") {
                    res.anime.moreInfo[key] = value
                        .split(",")
                        .map((i) => i.trim());
                    return;
                }
                if (key === "producers") {
                    res.anime.moreInfo[key] = value
                        .split(",")
                        .map((i) => i.trim());
                    return;
                }
                res.anime.moreInfo[key] = value;
            }
        );

        // more seasons
        const seasonsSelector: SelectorType =
            "#main-content .os-list a.os-item";
        $(seasonsSelector).each((_, el) => {
            res.seasons.push({
                id: $(el)?.attr("href")?.slice(1)?.trim() || null,
                name: $(el)?.attr("title")?.trim() || null,
                title: $(el)?.find(".title")?.text()?.trim(),
                poster:
                    $(el)
                        ?.find(".season-poster")
                        ?.attr("style")
                        ?.split(" ")
                        ?.pop()
                        ?.split("(")
                        ?.pop()
                        ?.split(")")[0] || null,
                isCurrent: $(el).hasClass("active"),
            });
        });

        const relatedAnimeSelector: SelectorType =
            "#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(1) .anif-block-ul ul li";
        res.relatedAnimes = extractMostPopularAnimes(
            $,
            relatedAnimeSelector,
            getAnimeAboutInfo.name
        );

        const mostPopularSelector: SelectorType =
            "#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(2) .anif-block-ul ul li";
        res.mostPopularAnimes = extractMostPopularAnimes(
            $,
            mostPopularSelector,
            getAnimeAboutInfo.name
        );

        const recommendedAnimeSelector: SelectorType =
            "#main-content .block_area.block_area_category .tab-content .flw-item";
        res.recommendedAnimes = extractAnimes(
            $,
            recommendedAnimeSelector,
            getAnimeAboutInfo.name
        );

        return res;
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getAnimeAboutInfo.name);
    }
}
