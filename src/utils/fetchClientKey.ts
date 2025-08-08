import axios from "axios";

import { load } from "cheerio";
import { USER_AGENT_HEADER } from "./constants.js";

export async function getClientKey(
    embedUrl: string,
    Referer: string
): Promise<string> {
    const salts: string[] = [];
    const maxAttempts = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await axios.get(embedUrl, {
                headers: {
                    Referer,
                    "User-Agent": USER_AGENT_HEADER,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            const html = response.data;

            const $ = load(html);

            // 1. Check for 48-character alphanumeric nonce in HTML
            const noncePattern1 = /\b[a-zA-Z0-9]{48}\b/;
            const noncePattern2 =
                /\b([a-zA-Z0-9]{16})\b.*?\b([a-zA-Z0-9]{16})\b.*?\b([a-zA-Z0-9]{16})\b/;
            const match1 = html.match(noncePattern1);
            const match2 = html.match(noncePattern2);

            if (match1) {
                salts.push(match1[0]);
            }
            if (match2 && match2.length === 4) {
                const combinedNonce = [match2[1], match2[2], match2[3]].join(
                    ""
                );

                salts.push(combinedNonce);
            }

            // 2. Check <script> tags for nonce variables
            const scripts = $("script").toArray();
            for (const script of scripts) {
                const content = $(script).html();
                if (!content) continue;

                // Check for window._xy_ws or similar variables
                const varMatch = content.match(
                    /_[a-zA-Z0-9_]+\s*=\s*['"]([a-zA-Z0-9]{32,})['"]/
                );
                if (varMatch?.[1]) {
                    salts.push(varMatch[1]);
                }

                // Check for object with x, y, z keys (like window._lk_db)
                const objMatch = content.match(
                    /_[a-zA-Z0-9_]+\s*=\s*{[^}]*x\s*:\s*['"]([a-zA-Z0-9]{16,})['"][^}]*y\s*:\s*['"]([a-zA-Z0-9]{16,})['"][^}]*z\s*:\s*['"]([a-zA-Z0-9]{16,})['"]/
                );
                if (objMatch?.[1] && objMatch[2] && objMatch[3]) {
                    const key = objMatch[1] + objMatch[2] + objMatch[3];

                    salts.push(key);
                }
            }

            // 3. Check <script nonce="..."> attributes
            const nonceAttr = $("script[nonce]").attr("nonce");
            if (nonceAttr && nonceAttr.length >= 32) {
                salts.push(nonceAttr);
            }

            // 4. Check meta tags and data attributes generically
            const metaContent = $("meta[name]")
                //@ts-ignore
                .filter((i, el) => $(el).attr("name")?.startsWith("_"))
                .attr("content");
            if (metaContent && /[a-zA-Z0-9]{32,}/.test(metaContent)) {
                salts.push(metaContent);
            }

            const dataAttr = $("[data-dpi], [data-key], [data-token]")
                .first()
                .attr();
            const dataKey =
                dataAttr?.["data-dpi"] ||
                dataAttr?.["data-key"] ||
                dataAttr?.["data-token"];
            if (dataKey && /[a-zA-Z0-9]{32,}/.test(dataKey)) {
                salts.push(dataKey);
            }

            // Remove duplicates and validate length
            const uniqueSalts = [...new Set(salts)].filter(
                (key) => key.length >= 32 && key.length <= 64
            );
            if (uniqueSalts.length > 0) {
                return uniqueSalts[0];
            }
        } catch (err: unknown) {
            return err instanceof Error ? err.message : "Unknown error";
        }
    }

    return "";
}
