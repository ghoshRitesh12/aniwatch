import { load, type CheerioAPI, type SelectorType } from "cheerio";
import { client } from "../../config/client.js";
import { HiAnimeError } from "../error.js";
import { SRC_BASE_URL, SRC_AJAX_URL } from "../../utils/index.js";
import type { ScrapedEpisodeServers } from "../types/scrapers/index.js";

export async function getEpisodeServers(
    episodeId: string
): Promise<ScrapedEpisodeServers> {
    const res: ScrapedEpisodeServers = {
        sub: [],
        dub: [],
        raw: [],
        episodeId,
        episodeNo: 0,
    };

    try {
        if (episodeId.trim() === "" || episodeId.indexOf("?ep=") === -1) {
            throw new HiAnimeError(
                "invalid anime episode id",
                getEpisodeServers.name,
                400
            );
        }

        const epId = episodeId.split("?ep=")[1];

        const { data } = await client.get(
            `${SRC_AJAX_URL}/v2/episode/servers?episodeId=${epId}`,
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Referer: new URL(`/watch/${episodeId}`, SRC_BASE_URL).href,
                },
            }
        );

        const $: CheerioAPI = load(data.html);

        const epNoSelector: SelectorType = ".server-notice strong";
        res.episodeNo = Number($(epNoSelector).text().split(" ").pop()) || 0;

        $(`.ps_-block.ps_-block-sub.servers-sub .ps__-list .server-item`).each(
            (_, el) => {
                res.sub.push({
                    serverName: $(el).find("a").text().toLowerCase().trim(),
                    serverId:
                        Number($(el)?.attr("data-server-id")?.trim()) || null,
                });
            }
        );

        $(`.ps_-block.ps_-block-sub.servers-dub .ps__-list .server-item`).each(
            (_, el) => {
                res.dub.push({
                    serverName: $(el).find("a").text().toLowerCase().trim(),
                    serverId:
                        Number($(el)?.attr("data-server-id")?.trim()) || null,
                });
            }
        );

        $(`.ps_-block.ps_-block-sub.servers-raw .ps__-list .server-item`).each(
            (_, el) => {
                res.raw.push({
                    serverName: $(el).find("a").text().toLowerCase().trim(),
                    serverId:
                        Number($(el)?.attr("data-server-id")?.trim()) || null,
                });
            }
        );

        return res;
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getEpisodeServers.name);
    }
}
