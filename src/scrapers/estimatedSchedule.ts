import { SRC_HOME_URL, SRC_AJAX_URL } from "../utils/index.js";
import { AxiosError } from "axios";
import createHttpError, { type HttpError } from "http-errors";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { type ScrapedEstimatedSchedule } from "../types/scrapers/index.js";
import { client } from "../config/client.js";

// /anime/schedule?date=${date}
async function scrapeEstimatedSchedule(
  date: string
): Promise<ScrapedEstimatedSchedule | HttpError> {
  const res: ScrapedEstimatedSchedule = {
    scheduledAnimes: [],
  };

  try {
    const estScheduleURL =
      `${SRC_AJAX_URL}/schedule/list?tzOffset=-330&date=${date}` as const;

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
        name: $(el)?.find("a .film-name.dynamic-name")?.text()?.trim() || null,
        jname:
          $(el)
            ?.find("a .film-name.dynamic-name")
            ?.attr("data-jname")
            ?.trim() || null,
        airingTimestamp,
        secondsUntilAiring: Math.floor((airingTimestamp - Date.now()) / 1000),
        episode: Number(
          $(el).find("a .fd-play button").text().trim().split(" ")[1]
        ),
      });
    });

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

export default scrapeEstimatedSchedule;
