import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { HiAnimeError } from "../error.js";
import { client } from "../../config/client.js";
import { SRC_AJAX_URL, SRC_HOME_URL } from "../../utils/index.js";
import type { ScrapedAnimeQtipInfo } from "../types/scrapers/index.js";

export async function getAnimeQtipInfo(
    animeId: string
): Promise<ScrapedAnimeQtipInfo> {
    const res: ScrapedAnimeQtipInfo = {
        anime: {
            id: animeId.trim(),
            name: null,
            malscore: null,
            quality: null,
            episodes: {
                sub: null,
                dub: null,
            },
            type: null,
            description: null,

            jname: null,
            synonyms: null,
            aired: null,
            status: null,
            genres: [],
        },
    };

    try {
        animeId = String(res.anime.id);
        const id = animeId.split("-").pop();
        if (animeId === "" || animeId.indexOf("-") === -1 || !id) {
            throw new HiAnimeError(
                "invalid anime id",
                getAnimeQtipInfo.name,
                400
            );
        }

        const mainPage = await client.get(`${SRC_AJAX_URL}/movie/qtip/${id}`, {
            headers: {
                Referer: SRC_HOME_URL,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const $: CheerioAPI = load(mainPage.data);
        const selector: SelectorType = ".pre-qtip-content";

        res.anime.id =
            $(selector)
                ?.find(".pre-qtip-button a.btn-play")
                ?.attr("href")
                ?.trim()
                ?.split("/")
                ?.pop() || null;
        res.anime.name =
            $(selector)?.find(".pre-qtip-title")?.text()?.trim() || null;
        res.anime.malscore =
            $(selector)
                ?.find(".pre-qtip-detail")
                ?.children()
                ?.first()
                ?.text()
                ?.trim() || null;
        res.anime.quality =
            $(selector)?.find(".tick .tick-quality")?.text()?.trim() || null;
        res.anime.type =
            $(selector)?.find(".badge.badge-quality")?.text()?.trim() || null;

        res.anime.episodes.sub =
            Number($(selector)?.find(".tick .tick-sub")?.text()?.trim()) ||
            null;
        res.anime.episodes.dub =
            Number($(selector)?.find(".tick .tick-dub")?.text()?.trim()) ||
            null;

        res.anime.description =
            $(selector)?.find(".pre-qtip-description")?.text()?.trim() || null;

        $(`${selector} .pre-qtip-line`).each((_, el) => {
            const key = $(el)
                .find(".stick")
                .text()
                .trim()
                .slice(0, -1)
                .toLowerCase();
            const value =
                key !== "genres"
                    ? $(el)?.find(".stick-text")?.text()?.trim() || null
                    : $(el)
                          ?.text()
                          ?.trim()
                          ?.slice(key.length + 1);

            switch (key) {
                case "japanese":
                    res.anime.jname = value;
                    break;
                case "synonyms":
                    res.anime.synonyms = value;
                    break;
                case "aired":
                    res.anime.aired = value;
                    break;
                case "status":
                    res.anime.status = value;
                    break;
                case "genres":
                    res.anime.genres =
                        value?.split(",")?.map((i) => i?.trim()) || [];
                    break;
            }
        });

        return res;
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getAnimeQtipInfo.name);
    }
}
