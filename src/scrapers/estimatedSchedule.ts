import { SRC_HOME_URL, SRC_AJAX_URL } from "../utils/index.js";
import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { type ScrapedEstimatedSchedule } from "../types/scrapers/index.js";
import { client } from "../config/client.js";
import { AniwatchError } from "../config/error.js";

// /anime/schedule?date=${date}
export async function getEstimatedSchedule(
  date: string
): Promise<ScrapedEstimatedSchedule> {
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
    throw AniwatchError.wrapError(err, getEstimatedSchedule.name);
  }
}
