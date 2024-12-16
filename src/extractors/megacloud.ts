import axios from "axios";
import crypto from "crypto";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { HiAnimeError } from "../hianime/error.js";
// import { __dirname } from "../utils/constants.js";

puppeteer.default.use(StealthPlugin());
// https://megacloud.tv/embed-2/e-1/dBqCr5BcOhnD?k=1

const megacloud = {
  script: "https://megacloud.tv/js/player/a/prod/e1-player.min.js?v=",
  sources: "https://megacloud.tv/embed-2/ajax/e-1/getSources?id=",
} as const;

type track = {
  file: string;
  kind: string;
  label?: string;
  default?: boolean;
};

type intro_outro = {
  start: number;
  end: number;
};

type unencryptedSrc = {
  file: string;
  type: string;
};

type extractedSrc = {
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
  private injectableJS: string = "";
  // static injectableJS: string | null = null;
  // static BUNDLED_FILE_NAME = "__megacloud.min.js" as const;

  private REQ_TIMEOUT = 6000; // 6 seconds
  private PAGE_TIMEOUT = this.REQ_TIMEOUT / 2;

  /**
   *
   * @param reqTimeoutMs defaults to 6000ms or 6 seconds
   */
  constructor(
    minInjectableJS: string,
    reqTimeoutMs: number = this.REQ_TIMEOUT
  ) {
    this.REQ_TIMEOUT = reqTimeoutMs;
    this.injectableJS = minInjectableJS;

    // if (MegaCloud.injectableJS === null) {
    //   MegaCloud.injectableJS = fs.readFileSync(
    //     path.resolve(process.cwd(), `./dist/${MegaCloud.BUNDLED_FILE_NAME}`),
    //     "utf-8"
    //   );
    // }
  }

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

      // console.log(JSON.stringify(srcsData, null, 2));

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
      // console.log(err);
      throw err;
    }
  }

  extractVariables(text: string) {
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

  getSecret(encryptedString: string, values: number[][]) {
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

  decrypt(encrypted: string, keyOrSecret: string, maybe_iv?: string) {
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
  matchingKey(value: string, script: string) {
    const regex = new RegExp(`,${value}=((?:0x)?([0-9a-fA-F]+))`);
    const match = script.match(regex);
    if (match) {
      return match[1].replace(/^0x/, "");
    } else {
      throw new Error("Failed to match the key");
    }
  }

  // inspired from https://github.com/luslucifer/megaTube-resolver/blob/main/simulate_hianime/index.js
  async extractUsingPuppeteer(embedIframeURL: URL): Promise<ExtractedData> {
    // let brwsr: Browser | null = null;
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

      const browser = await puppeteer.default.launch({
        headless: true,
        devtools: false,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-infobars",
          "--disable-web-security",
          "--disable-extensions",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-features=IsolateOrigins,site-per-process",
          "--disable-software-rasterizer",
          "--mute-audio",
          "--start-maximized",
        ],
      });

      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({
        Referer: embedIframeURL.href,
      });
      await page.setViewport({ width: 640, height: 480 });
      await page.setRequestInterception(true);
      page.setDefaultNavigationTimeout(this.PAGE_TIMEOUT);

      page.on("request", (req) => {
        const reqURL = req.url();
        // console.log("Request URL:", reqURL);

        if (
          reqURL.includes(".js") ||
          reqURL.includes("google") ||
          reqURL.includes("css") ||
          reqURL.includes("favicon.png")
        ) {
          // console.log("Blocking req to:", reqURL);
          req.abort();
        } else {
          req.continue();
        }
      });

      page.on("response", async (res) => {
        try {
          if (res.url().includes(megacloud.sources)) {
            const resp = await res.json();
            extractedData.intro = resp.intro ? resp.intro : extractedData.intro;
            extractedData.outro = resp.outro ? resp.outro : extractedData.outro;
          }
        } catch (err) {}
      });

      await page.goto(embedIframeURL.href, { waitUntil: "domcontentloaded" });

      // inject js into the page
      await page.evaluate((jsContent) => {
        try {
          eval(jsContent);
        } catch (err) {
          console.error("error executing js:", err);
          throw err;
        }
      }, this.injectableJS);

      return new Promise((resolve, reject) => {
        page.on("console", async (msg) => {
          try {
            const args = msg.args();

            for (const arg of args) {
              const extractedSrc = (await arg.jsonValue()) as extractedSrc;

              if (
                typeof extractedSrc === "object" &&
                extractedSrc?.sources !== undefined
              ) {
                // console.log("Found sources:", extractedSrc);

                if (Array.isArray(extractedSrc.sources)) {
                  extractedData.sources = extractedSrc.sources.map((s) => ({
                    url: s.file,
                    type: s.type,
                  }));
                }
                extractedData.tracks = extractedSrc.tracks;

                await browser.close();
                resolve(extractedData);
                return;
              }
            }
          } catch (err) {
            reject(err);
          }
        });

        // Optional timeout to ensure the browser doesn't hang indefinitely
        setTimeout(async () => {
          await browser.close();
          reject(new Error("timeout waiting for sources"));
        }, this.REQ_TIMEOUT);
      });
    } catch (err) {
      throw err;
    }
  }
}

export default MegaCloud;
