import axios from "axios";
import crypto from "crypto";
import { HiAnimeError } from "../hianime/error.js";
// import { getSources } from "./megacloud.getsrcs.js";
import CryptoJS from "crypto-js";
import * as cheerio from "cheerio";
import { getMegaCloudClientKey, decryptSrc2 } from '../utils/index.js';

// https://megacloud.tv/embed-2/e-1/dBqCr5BcOhnD?k=1

const megacloud = {
    script: "https://megacloud.tv/js/player/a/prod/e1-player.min.js?v=",
    sources: "https://megacloud.tv/embed-2/ajax/e-1/getSources?id=",
} as const;

export type track = {
    file: string;
    kind: string;
    label?: string;
    default?: boolean;
};

type intro_outro = {
    start: number;
    end: number;
};

export type unencryptedSrc = {
    file: string;
    type: string;
};

export type extractedSrc = {
    sources: string | unencryptedSrc[];
    tracks: track[];
    encrypted: boolean;
    intro: intro_outro;
    outro: intro_outro;
    server: number;
};

type ExtractedData = Pick<extractedSrc, "intro" | "outro" | "tracks"> & {
    sources: { url: string; type: string }[];
};

class MegaCloud {
    // private serverName = "megacloud";

    async extract(videoUrl: URL) {
        try {
            const extractedData: ExtractedData = {
                tracks: [],
                intro: {
                    start: 0,
                    end: 0,
                },
                outro: {
                    start: 0,
                    end: 0,
                },
                sources: [],
            };

            const videoId = videoUrl?.href?.split("/")?.pop()?.split("?")[0];
            const { data: srcsData } = await axios.get<extractedSrc>(
                megacloud.sources.concat(videoId || ""),
                {
                    headers: {
                        Accept: "*/*",
                        "X-Requested-With": "XMLHttpRequest",
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                        Referer: videoUrl.href,
                    },
                }
            );
            if (!srcsData) {
                throw new HiAnimeError(
                    "Url may have an invalid video id",
                    "getAnimeEpisodeSources",
                    400
                );
            }

            // log.info(JSON.stringify(srcsData, null, 2));

            const encryptedString = srcsData.sources;
            if (!srcsData.encrypted && Array.isArray(encryptedString)) {
                extractedData.intro = srcsData.intro;
                extractedData.outro = srcsData.outro;
                extractedData.tracks = srcsData.tracks;
                extractedData.sources = encryptedString.map((s) => ({
                    url: s.file,
                    type: s.type,
                }));

                return extractedData;
            }

            let text: string;
            const { data } = await axios.get(
                megacloud.script.concat(Date.now().toString())
            );

            text = data;
            if (!text) {
                throw new HiAnimeError(
                    "Couldn't fetch script to decrypt resource",
                    "getAnimeEpisodeSources",
                    500
                );
            }

            const vars = this.extractVariables(text);
            if (!vars.length) {
                throw new Error(
                    "Can't find variables. Perhaps the extractor is outdated."
                );
            }

            const { secret, encryptedSource } = this.getSecret(
                encryptedString as string,
                vars
            );
            const decrypted = this.decrypt(encryptedSource, secret);
            try {
                const sources = JSON.parse(decrypted);
                extractedData.intro = srcsData.intro;
                extractedData.outro = srcsData.outro;
                extractedData.tracks = srcsData.tracks;
                extractedData.sources = sources.map((s: any) => ({
                    url: s.file,
                    type: s.type,
                }));

                return extractedData;
            } catch (error) {
                throw new HiAnimeError(
                    "Failed to decrypt resource",
                    "getAnimeEpisodeSources",
                    500
                );
            }
        } catch (err) {
            // log.info(err);
            throw err;
        }
    }

    private extractVariables(text: string) {
        // copied from github issue #30 'https://github.com/ghoshRitesh12/aniwatch-api/issues/30'
        const regex =
            /case\s*0x[0-9a-f]+:(?![^;]*=partKey)\s*\w+\s*=\s*(\w+)\s*,\s*\w+\s*=\s*(\w+);/g;
        const matches = text.matchAll(regex);
        const vars = Array.from(matches, (match) => {
            const matchKey1 = this.matchingKey(match[1], text);
            const matchKey2 = this.matchingKey(match[2], text);
            try {
                return [parseInt(matchKey1, 16), parseInt(matchKey2, 16)];
            } catch (e) {
                return [];
            }
        }).filter((pair) => pair.length > 0);

        return vars;
    }

    private getSecret(encryptedString: string, values: number[][]) {
        let secret = "",
            encryptedSource = "",
            encryptedSourceArray = encryptedString.split(""),
            currentIndex = 0;

        for (const index of values) {
            const start = index[0] + currentIndex;
            const end = start + index[1];

            for (let i = start; i < end; i++) {
                secret += encryptedString[i];
                encryptedSourceArray[i] = "";
            }
            currentIndex += index[1];
        }

        encryptedSource = encryptedSourceArray.join("");

        return { secret, encryptedSource };
    }

    private decrypt(encrypted: string, keyOrSecret: string, maybe_iv?: string) {
        let key;
        let iv;
        let contents;
        if (maybe_iv) {
            key = keyOrSecret;
            iv = maybe_iv;
            contents = encrypted;
        } else {
            // copied from 'https://github.com/brix/crypto-js/issues/468'
            const cypher = Buffer.from(encrypted, "base64");
            const salt = cypher.subarray(8, 16);
            const password = Buffer.concat([
                Buffer.from(keyOrSecret, "binary"),
                salt,
            ]);
            const md5Hashes = [];
            let digest = password;
            for (let i = 0; i < 3; i++) {
                md5Hashes[i] = crypto.createHash("md5").update(digest).digest();
                digest = Buffer.concat([md5Hashes[i], password]);
            }
            key = Buffer.concat([md5Hashes[0], md5Hashes[1]]);
            iv = md5Hashes[2];
            contents = cypher.subarray(16);
        }

        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        const decrypted =
            decipher.update(
                contents as any,
                typeof contents === "string" ? "base64" : undefined,
                "utf8"
            ) + decipher.final();

        return decrypted;
    }

    // function copied from github issue #30 'https://github.com/ghoshRitesh12/aniwatch-api/issues/30'
    private matchingKey(value: string, script: string) {
        const regex = new RegExp(`,${value}=((?:0x)?([0-9a-fA-F]+))`);
        const match = script.match(regex);
        if (match) {
            return match[1].replace(/^0x/, "");
        } else {
            throw new Error("Failed to match the key");
        }
    }

    // https://megacloud.tv/embed-2/e-1/1hnXq7VzX0Ex?k=1
    // async extract2(embedIframeURL: URL): Promise<ExtractedData> {
    //     try {
    //         const extractedData: ExtractedData = {
    //             tracks: [],
    //             intro: {
    //                 start: 0,
    //                 end: 0,
    //             },
    //             outro: {
    //                 start: 0,
    //                 end: 0,
    //             },
    //             sources: [],
    //         };

    //         const xrax = embedIframeURL.pathname.split("/").pop() || "";

    //         const resp = await getSources(xrax);
    //         if (!resp) return extractedData;

    //         if (Array.isArray(resp.sources)) {
    //             extractedData.sources = resp.sources.map((s) => ({
    //                 url: s.file,
    //                 type: s.type,
    //             }));
    //         }
    //         extractedData.intro = resp.intro ? resp.intro : extractedData.intro;
    //         extractedData.outro = resp.outro ? resp.outro : extractedData.outro;
    //         extractedData.tracks = resp.tracks;

    //         return extractedData;
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    //credit to https://github.com/itzzzme/megacloud-keys for autogenerated keys
    async extract3(embedIframeURL: URL): Promise<ExtractedData> {
        try {
            const response = await axios.get(
                "https://raw.githubusercontent.com/itzzzme/megacloud-keys/refs/heads/main/key.txt"
            );
            const key = response.data;
            const extractedData: ExtractedData = {
                tracks: [],
                intro: {
                    start: 0,
                    end: 0,
                },
                outro: {
                    start: 0,
                    end: 0,
                },
                sources: [],
            };

            const match = /\/([^\/\?]+)\?/.exec(embedIframeURL.href);

            const sourceId = match?.[1];

            if (!sourceId)
                throw new Error("Unable to extract sourceId from embed URL");

            const megacloudUrl = `https://megacloud.blog/embed-2/v2/e-1/getSources?id=${sourceId}`;
            const { data: rawSourceData } = await axios.get(megacloudUrl);

            const encrypted = rawSourceData?.sources;
            if (!encrypted)
                throw new Error("Encrypted source missing in response");
            const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
                CryptoJS.enc.Utf8
            );
            let decryptedSources;
            try {
                decryptedSources = JSON.parse(decrypted);
            } catch (e) {
                throw new Error("Decrypted data is not valid JSON");
            }

            extractedData.intro = rawSourceData.intro
                ? rawSourceData.intro
                : extractedData.intro;
            extractedData.outro = rawSourceData.outro
                ? rawSourceData.outro
                : extractedData.outro;

            extractedData.tracks =
                rawSourceData.tracks?.map((track: any) => ({
                    url: track.file,
                    lang: track.label ? track.label : track.kind,
                })) || [];
            extractedData.sources = decryptedSources.map((s: any) => ({
                url: s.file,
                isM3U8: s.type === "hls",
                type: s.type,
            }));

            return extractedData;
        } catch (err) {
            throw err;
        }
    }

    async extract4(embedIframeURL: string): Promise<ExtractedData> {
        const extractedData: ExtractedData = {
            tracks: [],
            intro: {
                start: 0,
                end: 0,
            },
            outro: {
                start: 0,
                end: 0,
            },
            sources: [],
        };

        const epId = embedIframeURL.split("?ep=")[1];

        const iframe = await fetch(
            `https://megaplay.buzz/stream/s-2/${epId}/sub`,
            {
                headers: {
                    Host: "megaplay.buzz",
                    "User-Agent":
                        "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    DNT: "1",
                    "Sec-GPC": "1",
                    Connection: "keep-alive",
                    Referer: "https://megaplay.buzz/api",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "iframe",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-User": "?1",
                    Priority: "u=4",
                    TE: "trailers",
                },
            }
        );
        if (!iframe.ok) throw new Error("Episode is not available");

        const iframeBody = await iframe.text();

        const $ = cheerio.load(iframeBody);

        const id = $("#megaplay-player").attr("data-id");

        const sources = await fetch(
            `https://megaplay.buzz/stream/getSources?id=${id}&id=${id}`,
            {
                headers: {
                    Host: "megaplay.buzz",
                    "User-Agent":
                        "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
                    Accept: "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "X-Requested-With": "XMLHttpRequest",
                    DNT: "1",
                    "Sec-GPC": "1",
                    Connection: "keep-alive",
                    Referer: "https://megaplay.buzz/stream/s-2/141679/sub",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    TE: "trailers",
                },
            }
        );

        const sourcesJson = await sources.json();

        extractedData.intro = sourcesJson.intro;
        extractedData.outro = sourcesJson.outro;
        extractedData.tracks =
            sourcesJson.tracks?.map((track: any) => ({
                url: track.file,
                lang: track.label ? track.label : track.kind,
            })) || [];
        extractedData.sources = [
            {
                url: sourcesJson.sources.file,
                type: "hls",
            },
        ];

        return extractedData;
    }
    async extract5(embedIframeURL: URL): Promise<ExtractedData> {
        // console.log("new extraction used")
        try {
            // this key is extracted the same way as extract3's key
            const response = await axios.get(
                "https://raw.githubusercontent.com/yogesh-hacker/MegacloudKeys/refs/heads/main/keys.json"
            );
            const key = response.data;
            const megacloudKey = key["mega"];
            const extractedData: ExtractedData = {
                tracks: [],
                intro: {
                    start: 0,
                    end: 0,
                },
                outro: {
                    start: 0,
                    end: 0,
                },
                sources: [],
            };

            const match = /\/([^\/\?]+)\?/.exec(embedIframeURL.href);

            const sourceId = match?.[1];
            if (!sourceId)
                throw new Error("Unable to extract sourceId from embed URL");

            // added gathering the client key
            const clientKey = await getMegaCloudClientKey(sourceId);
            if (!clientKey)
                throw new Error("Unable to extract client key from iframe");

            // endpoint changed
            const megacloudUrl = `https://megacloud.blog/embed-2/v3/e-1/getSources?id=${sourceId}&_k=${clientKey}`
            const { data: rawSourceData } = await axios.get(megacloudUrl);
            let decryptedSources;
            if (!(rawSourceData?.encrypted)){
                decryptedSources = rawSourceData?.sources;
            } else {
                const encrypted = rawSourceData?.sources;
                if (!encrypted)
                    throw new Error("Encrypted source missing in response");
                console.log(clientKey, megacloudKey, encrypted);
                
                const decrypted = decryptSrc2(encrypted, clientKey, megacloudKey)
            
                try {
                    decryptedSources = JSON.parse(decrypted);
                } catch (e) {
                    throw new Error("Decrypted data is not valid JSON");
                }
            }
            extractedData.tracks = rawSourceData.tracks;
            extractedData.intro = rawSourceData.intro;
            extractedData.outro = rawSourceData.outro;
            extractedData.intro = rawSourceData.intro
                ? rawSourceData.intro
                : extractedData.intro;
            extractedData.outro = rawSourceData.outro
                ? rawSourceData.outro
                : extractedData.outro;

            extractedData.tracks =
                rawSourceData.tracks?.map((track: any) => ({
                    url: track.file,
                    lang: track.label ? track.label : track.kind,
                })) || [];
            extractedData.sources = decryptedSources.map((s: any) => ({
                url: s.file,
                isM3U8: s.type === "hls",
                type: s.type,
            }));
            
            return extractedData;
        } catch (err){
            throw err;
        }
    }
}

export default MegaCloud;
