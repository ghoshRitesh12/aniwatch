import axios from "axios";
import { load, type CheerioAPI } from "cheerio";
import { client } from "../../config/client.js";
import { HiAnimeError } from "../error.js";
import {
    SRC_AJAX_URL,
    SRC_BASE_URL,
    retrieveServerId,
    USER_AGENT_HEADER,
} from "../../utils/index.js";
import {
    RapidCloud,
    StreamSB,
    StreamTape,
    MegaCloud,
} from "../../extractors/index.js";
import { log } from "../../config/logger.js";
import { type AnimeServers, Servers } from "../types/anime.js";
import type { ScrapedAnimeEpisodesSources } from "../types/scrapers/index.js";

// vidtreaming -> 4
// rapidcloud  -> 1
// streamsb -> 5
// streamtape -> 3

async function _getAnimeEpisodeSources(
    episodeId: string,
    server: AnimeServers = Servers.VidStreaming,
    category: "sub" | "dub" | "raw" = "sub"
): Promise<ScrapedAnimeEpisodesSources> {
    if (episodeId.startsWith("http")) {
        const serverUrl = new URL(episodeId);
        switch (server) {
            case Servers.VidStreaming:
            case Servers.VidCloud:
                return {
                    headers: { Referer: `${serverUrl.origin}/` },
                    // disabled for the timebeing
                    // ...(await new MegaCloud().extract(serverUrl)),
                    ...(await new MegaCloud().extract2(serverUrl)),
                };
            case Servers.StreamSB:
                return {
                    headers: {
                        Referer: serverUrl.href,
                        watchsb: "streamsb",
                        "User-Agent": USER_AGENT_HEADER,
                    },
                    sources: await new StreamSB().extract(serverUrl, true),
                };
            case Servers.StreamTape:
                return {
                    headers: {
                        Referer: serverUrl.href,
                        "User-Agent": USER_AGENT_HEADER,
                    },
                    sources: await new StreamTape().extract(serverUrl),
                };
            default: // vidcloud
                return {
                    headers: { Referer: serverUrl.href },
                    ...(await new RapidCloud().extract(serverUrl)),
                };
        }
    }

    const epId = new URL(`/watch/${episodeId}`, SRC_BASE_URL).href;
    log.info(`EPISODE_ID: ${epId}`);

    try {
        const resp = await client.get(
            `${SRC_AJAX_URL}/v2/episode/servers?episodeId=${epId.split("?ep=")[1]}`,
            {
                headers: {
                    Referer: epId,
                    "X-Requested-With": "XMLHttpRequest",
                },
            }
        );

        const $: CheerioAPI = load(resp.data.html);

        let serverId: string | null = null;

        try {
            log.info(`THE SERVER: ${JSON.stringify(server)}`);

            switch (server) {
                case Servers.VidCloud: {
                    serverId = retrieveServerId($, 1, category);
                    if (!serverId) throw new Error("RapidCloud not found");
                    break;
                }
                case Servers.VidStreaming: {
                    serverId = retrieveServerId($, 4, category);
                    log.info(`SERVER_ID: ${serverId}`);
                    if (!serverId) throw new Error("VidStreaming not found");
                    break;
                }
                case Servers.StreamSB: {
                    serverId = retrieveServerId($, 5, category);
                    if (!serverId) throw new Error("StreamSB not found");
                    break;
                }
                case Servers.StreamTape: {
                    serverId = retrieveServerId($, 3, category);
                    if (!serverId) throw new Error("StreamTape not found");
                    break;
                }
            }
        } catch (err) {
            throw new HiAnimeError(
                "Couldn't find server. Try another server",
                getAnimeEpisodeSources.name,
                500
            );
        }

        const {
            data: { link },
        } = await client.get(
            `${SRC_AJAX_URL}/v2/episode/sources?id=${serverId}`
        );
        log.info(`THE LINK: ${link}`);

        return await _getAnimeEpisodeSources(link, server);
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getAnimeEpisodeSources.name);
    }
}

type AnilistID = number | null;
type MalID = number | null;

export async function getAnimeEpisodeSources(
    episodeId: string,
    server: AnimeServers,
    category: "sub" | "dub" | "raw"
): Promise<
    ScrapedAnimeEpisodesSources & { anilistID: AnilistID; malID: MalID }
> {
    try {
        if (episodeId === "" || episodeId.indexOf("?ep=") === -1) {
            throw new HiAnimeError(
                "invalid anime episode id",
                getAnimeEpisodeSources.name,
                400
            );
        }
        if (category.trim() === "") {
            throw new HiAnimeError(
                "invalid anime episode category",
                getAnimeEpisodeSources.name,
                400
            );
        }

        let malID: MalID;
        let anilistID: AnilistID;
        const animeURL = new URL(episodeId?.split("?ep=")[0], SRC_BASE_URL)
            ?.href;

        const [episodeSrcData, animeSrc] = await Promise.all([
            _getAnimeEpisodeSources(episodeId, server, category),
            axios.get(animeURL, {
                headers: {
                    Referer: SRC_BASE_URL,
                    "User-Agent": USER_AGENT_HEADER,
                    "X-Requested-With": "XMLHttpRequest",
                },
            }),
        ]);
        log.info(`EPISODE_SRC_DATA: ${JSON.stringify(episodeSrcData)}`);

        const $: CheerioAPI = load(animeSrc?.data);

        try {
            anilistID = Number(
                JSON.parse($("body")?.find("#syncData")?.text())?.anilist_id
            );
            malID = Number(
                JSON.parse($("body")?.find("#syncData")?.text())?.mal_id
            );
        } catch (err) {
            anilistID = null;
            malID = null;
        }

        return {
            ...episodeSrcData,
            anilistID,
            malID,
        };
    } catch (err: any) {
        throw HiAnimeError.wrapError(err, getAnimeEpisodeSources.name);
    }
}
