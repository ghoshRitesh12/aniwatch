import { load, type CheerioAPI, type SelectorType } from "cheerio";
import type {
    ScrapedEstimatedSchedule,
    ScrapedNextEpisodeSchedule,
} from "../types/scrapers/index.js";
import { client } from "../../config/client.js";
import { HiAnimeError } from "../error.js";
import { SRC_HOME_URL, SRC_AJAX_URL, SRC_BASE_URL } from "../../utils/index.js";

export async function getEstimatedSchedule(
    date: string,
    tzOffset: number = -330
): Promise<ScrapedEstimatedSchedule> {
    const res: ScrapedEstimatedSchedule = {
        scheduledAnimes: [],
    };
    try {
        date = date?.trim();
        if (date === "" || /^\d{4}-\d{2}-\d{2}$/.test(date) === false) {
            throw new HiAnimeError(
                "invalid date format",
                getEstimatedSchedule.name,
                400
            );
        }

        if (tzOffset && (typeof tzOffset !== "number" || isNaN(tzOffset))) {
            throw new HiAnimeError(
                "invalid timezone offset",
                getEstimatedSchedule.name,
                400
            );
        }

        const estScheduleURL =
            `${SRC_AJAX_URL}/schedule/list?tzOffset=${tzOffset}&date=${date}` as const;
        const mainPage = await client.get(estScheduleURL, {
            headers: {
                Accept: "*/*",
                Referer: SRC_HOME_URL,
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const $: CheerioAPI = load(mainPage?.data?.html);
        const selector: SelectorType = "li";
        if ($(selector)?.text()?.trim()?.includes("No data to display")) {
            return res;
        }
        $(selector).each((_, el) => {
            const airingTimestamp = new Date(
                `${date}T${$(el)?.find("a .time")?.text()?.trim()}:00`
            ).getTime();
            res.scheduledAnimes.push({
                id: $(el)?.find("a")?.attr("href")?.slice(1)?.trim() || null,
                time: $(el)?.find("a .time")?.text()?.trim() || null,
                name:
                    $(el)?.find("a .film-name.dynamic-name")?.text()?.trim() ||
                    null,
                jname:
                    $(el)
                        ?.find("a .film-name.dynamic-name")
                        ?.attr("data-jname")
                        ?.trim() || null,
                airingTimestamp,
                secondsUntilAiring: Math.floor(
                    (airingTimestamp - Date.now()) / 1000
                ),
                episode: Number(
                    $(el).find("a .fd-play button").text().trim().split(" ")[1]
                ),
            });
        });
        return res;
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getEstimatedSchedule.name);
    }
}

export async function getNextEpisodeSchedule(
    animeId: string
): Promise<ScrapedNextEpisodeSchedule> {
    const res: ScrapedNextEpisodeSchedule = {
        airingISOTimestamp: null,
        airingTimestamp: null,
        secondsUntilAiring: null,
    };
    try {
        animeId = animeId?.trim();
        if (!animeId || animeId.indexOf("-") === -1) {
            throw new HiAnimeError(
                "invalid anime id",
                getNextEpisodeSchedule.name,
                400
            );
        }

        const animeUrl = `${SRC_BASE_URL}/watch/${animeId}` as const;
        const mainPage = await client.get<string>(animeUrl, {
            headers: {
                Accept: "*/*",
                Referer: SRC_HOME_URL,
            },
        });

        const $: CheerioAPI = load(mainPage.data);
        const selector: SelectorType =
            ".schedule-alert > .alert.small > span:last";

        const timestamp = String(
            $(selector).attr("data-value")?.trim() || null
        );
        const schedule = new Date(timestamp);
        if (isNaN(schedule.getTime())) return res;

        res.airingISOTimestamp = schedule.toISOString();
        res.airingTimestamp = schedule.getTime();
        res.secondsUntilAiring = Math.floor(
            (res.airingTimestamp - Date.now()) / 1000
        );

        return res;
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getNextEpisodeSchedule.name);
    }
}
