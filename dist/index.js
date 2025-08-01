var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/hianime/hianime.ts
var hianime_exports = {};
__export(hianime_exports, {
  AZ_LIST_SORT_OPTIONS: () => AZ_LIST_SORT_OPTIONS,
  SEARCH_PAGE_FILTERS: () => SEARCH_PAGE_FILTERS,
  Scraper: () => Scraper,
  Servers: () => Servers
});

// src/hianime/scrapers/homePage.ts
import { load } from "cheerio";

// src/config/client.ts
import axios, { AxiosError } from "axios";

// src/utils/constants.ts
var ACCEPT_ENCODING_HEADER = "gzip, deflate, br";
var USER_AGENT_HEADER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var ACCEPT_HEADER = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";
var DOMAIN = "hianimez.to";
var SRC_BASE_URL = `https://${DOMAIN}`;
var SRC_AJAX_URL = `${SRC_BASE_URL}/ajax`;
var SRC_HOME_URL = `${SRC_BASE_URL}/home`;
var SRC_SEARCH_URL = `${SRC_BASE_URL}/search`;
var SEARCH_PAGE_FILTERS = {
  GENRES_ID_MAP: {
    action: 1,
    adventure: 2,
    cars: 3,
    comedy: 4,
    dementia: 5,
    demons: 6,
    drama: 8,
    ecchi: 9,
    fantasy: 10,
    game: 11,
    harem: 35,
    historical: 13,
    horror: 14,
    isekai: 44,
    josei: 43,
    kids: 15,
    magic: 16,
    "martial-arts": 17,
    mecha: 18,
    military: 38,
    music: 19,
    mystery: 7,
    parody: 20,
    police: 39,
    psychological: 40,
    romance: 22,
    samurai: 21,
    school: 23,
    "sci-fi": 24,
    seinen: 42,
    shoujo: 25,
    "shoujo-ai": 26,
    shounen: 27,
    "shounen-ai": 28,
    "slice-of-life": 36,
    space: 29,
    sports: 30,
    "super-power": 31,
    supernatural: 37,
    thriller: 41,
    vampire: 32
  },
  TYPE_ID_MAP: {
    all: 0,
    movie: 1,
    tv: 2,
    ova: 3,
    ona: 4,
    special: 5,
    music: 6
  },
  STATUS_ID_MAP: {
    all: 0,
    "finished-airing": 1,
    "currently-airing": 2,
    "not-yet-aired": 3
  },
  RATED_ID_MAP: {
    all: 0,
    g: 1,
    pg: 2,
    "pg-13": 3,
    r: 4,
    "r+": 5,
    rx: 6
  },
  SCORE_ID_MAP: {
    all: 0,
    appalling: 1,
    horrible: 2,
    "very-bad": 3,
    bad: 4,
    average: 5,
    fine: 6,
    good: 7,
    "very-good": 8,
    great: 9,
    masterpiece: 10
  },
  SEASON_ID_MAP: {
    all: 0,
    spring: 1,
    summer: 2,
    fall: 3,
    winter: 4
  },
  LANGUAGE_ID_MAP: {
    all: 0,
    sub: 1,
    dub: 2,
    "sub-&-dub": 3
  },
  SORT_ID_MAP: {
    default: "default",
    "recently-added": "recently_added",
    "recently-updated": "recently_updated",
    score: "score",
    "name-a-z": "name_az",
    "released-date": "released_date",
    "most-watched": "most_watched"
  }
};
var AZ_LIST_SORT_OPTIONS = {
  all: true,
  other: true,
  "0-9": true,
  a: true,
  b: true,
  c: true,
  d: true,
  e: true,
  f: true,
  g: true,
  h: true,
  i: true,
  j: true,
  k: true,
  l: true,
  m: true,
  n: true,
  o: true,
  p: true,
  q: true,
  r: true,
  s: true,
  t: true,
  u: true,
  v: true,
  w: true,
  x: true,
  y: true,
  z: true
};

// src/config/client.ts
var clientConfig = {
  timeout: 8e3,
  // baseURL: SRC_BASE_URL,
  headers: {
    Accept: ACCEPT_HEADER,
    "User-Agent": USER_AGENT_HEADER,
    "Accept-Encoding": ACCEPT_ENCODING_HEADER
  }
};
var client = axios.create(clientConfig);

// src/hianime/error.ts
import { AxiosError as AxiosError2 } from "axios";

// src/config/logger.ts
import { pino } from "pino";
function isDevEnv() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
}
var loggerOptions = {
  level: "info",
  transport: isDevEnv() ? {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard"
    }
  } : void 0,
  formatters: {
    level(label) {
      return {
        level: label.toUpperCase(),
        context: "aniwatch-pkg"
      };
    }
  },
  redact: !isDevEnv() ? ["hostname"] : [],
  timestamp: pino.stdTimeFunctions.isoTime
};
var log = pino(loggerOptions);

// src/hianime/error.ts
var ANSI_ESC_CODE_COLOR_RED = "\x1B[31m";
var ANSI_ESC_CODE_COLOR_RESET = "\x1B[0m";
var HiAnimeError = class _HiAnimeError extends Error {
  static DEFAULT_ERROR_STATUS = 500;
  static DEFAULT_ERROR_MESSAGE = "Something went wrong";
  scraper = _HiAnimeError.DEFAULT_ERROR_MESSAGE;
  status = _HiAnimeError.DEFAULT_ERROR_STATUS;
  constructor(errMsg, scraperName, status) {
    super(`${scraperName}: ${errMsg}`);
    this.name = _HiAnimeError.name;
    this.scraper = scraperName;
    if (status) {
      this.status = status >= 400 && status < 600 ? status : _HiAnimeError.DEFAULT_ERROR_STATUS;
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _HiAnimeError);
    }
    this.logError();
  }
  static wrapError(err, scraperName) {
    if (err instanceof _HiAnimeError) {
      return err;
    }
    if (err instanceof AxiosError2) {
      const statusText = err?.response?.statusText || _HiAnimeError.DEFAULT_ERROR_MESSAGE;
      return new _HiAnimeError(
        "fetchError: " + statusText,
        scraperName,
        err.status || _HiAnimeError.DEFAULT_ERROR_STATUS
      );
    }
    return new _HiAnimeError(
      err?.message || _HiAnimeError.DEFAULT_ERROR_MESSAGE,
      scraperName
    );
  }
  json() {
    return {
      status: this.status,
      message: this.message
    };
  }
  logError() {
    log.error(
      ANSI_ESC_CODE_COLOR_RED + JSON.stringify(
        {
          status: this.status,
          scraper: this.scraper,
          message: this.message
        },
        null,
        2
      ) + ANSI_ESC_CODE_COLOR_RESET
    );
  }
};

// src/utils/methods.ts
var extractAnimes = ($, selector, scraperName) => {
  try {
    const animes = [];
    $(selector).each((_, el) => {
      const animeId = $(el).find(".film-detail .film-name .dynamic-name")?.attr("href")?.slice(1).split("?ref=search")[0] || null;
      animes.push({
        id: animeId,
        name: $(el).find(".film-detail .film-name .dynamic-name")?.text()?.trim(),
        jname: $(el).find(".film-detail .film-name .dynamic-name")?.attr("data-jname")?.trim() || null,
        poster: $(el).find(".film-poster .film-poster-img")?.attr("data-src")?.trim() || null,
        duration: $(el).find(".film-detail .fd-infor .fdi-item.fdi-duration")?.text()?.trim(),
        type: $(el).find(".film-detail .fd-infor .fdi-item:nth-of-type(1)")?.text()?.trim(),
        rating: $(el).find(".film-poster .tick-rate")?.text()?.trim() || null,
        episodes: {
          sub: Number(
            $(el).find(".film-poster .tick-sub")?.text()?.trim().split(" ").pop()
          ) || null,
          dub: Number(
            $(el).find(".film-poster .tick-dub")?.text()?.trim().split(" ").pop()
          ) || null
        }
      });
    });
    return animes;
  } catch (err) {
    throw HiAnimeError.wrapError(err, scraperName);
  }
};
var extractTop10Animes = ($, period, scraperName) => {
  try {
    const animes = [];
    const selector = `#top-viewed-${period} ul li`;
    $(selector).each((_, el) => {
      animes.push({
        id: $(el).find(".film-detail .dynamic-name")?.attr("href")?.slice(1).trim() || null,
        rank: Number($(el).find(".film-number span")?.text()?.trim()) || null,
        name: $(el).find(".film-detail .dynamic-name")?.text()?.trim() || null,
        jname: $(el).find(".film-detail .dynamic-name")?.attr("data-jname")?.trim() || null,
        poster: $(el).find(".film-poster .film-poster-img")?.attr("data-src")?.trim() || null,
        episodes: {
          sub: Number(
            $(el).find(
              ".film-detail .fd-infor .tick-item.tick-sub"
            )?.text()?.trim()
          ) || null,
          dub: Number(
            $(el).find(
              ".film-detail .fd-infor .tick-item.tick-dub"
            )?.text()?.trim()
          ) || null
        }
      });
    });
    return animes;
  } catch (err) {
    throw HiAnimeError.wrapError(err, scraperName);
  }
};
var extractMostPopularAnimes = ($, selector, scraperName) => {
  try {
    const animes = [];
    $(selector).each((_, el) => {
      animes.push({
        id: $(el).find(".film-detail .dynamic-name")?.attr("href")?.slice(1).trim() || null,
        name: $(el).find(".film-detail .dynamic-name")?.text()?.trim() || null,
        jname: $(el).find(".film-detail .film-name .dynamic-name").attr("data-jname")?.trim() || null,
        poster: $(el).find(".film-poster .film-poster-img")?.attr("data-src")?.trim() || null,
        episodes: {
          sub: Number(
            $(el)?.find(".fd-infor .tick .tick-sub")?.text()?.trim()
          ) || null,
          dub: Number(
            $(el)?.find(".fd-infor .tick .tick-dub")?.text()?.trim()
          ) || null
        },
        type: $(el)?.find(".fd-infor .tick")?.text()?.trim()?.replace(/[\s\n]+/g, " ")?.split(" ")?.pop() || null
      });
    });
    return animes;
  } catch (err) {
    throw HiAnimeError.wrapError(err, scraperName);
  }
};
function retrieveServerId($, index, category) {
  return $(
    `.ps_-block.ps_-block-sub.servers-${category} > .ps__-list .server-item`
  )?.map(
    (_, el) => $(el).attr("data-server-id") == `${index}` ? $(el) : null
  )?.get()[0]?.attr("data-id") || null;
}
function getGenresFilterVal(genreNames) {
  if (genreNames.length < 1) {
    return void 0;
  }
  return genreNames.map((name) => SEARCH_PAGE_FILTERS["GENRES_ID_MAP"][name]).join(",");
}
function getSearchFilterValue(key, rawValue) {
  rawValue = rawValue.trim();
  if (!rawValue) return void 0;
  switch (key) {
    case "genres": {
      return getGenresFilterVal(rawValue.split(","));
    }
    case "type": {
      const val = SEARCH_PAGE_FILTERS["TYPE_ID_MAP"][rawValue] ?? 0;
      return val === 0 ? void 0 : `${val}`;
    }
    case "status": {
      const val = SEARCH_PAGE_FILTERS["STATUS_ID_MAP"][rawValue] ?? 0;
      return val === 0 ? void 0 : `${val}`;
    }
    case "rated": {
      const val = SEARCH_PAGE_FILTERS["RATED_ID_MAP"][rawValue] ?? 0;
      return val === 0 ? void 0 : `${val}`;
    }
    case "score": {
      const val = SEARCH_PAGE_FILTERS["SCORE_ID_MAP"][rawValue] ?? 0;
      return val === 0 ? void 0 : `${val}`;
    }
    case "season": {
      const val = SEARCH_PAGE_FILTERS["SEASON_ID_MAP"][rawValue] ?? 0;
      return val === 0 ? void 0 : `${val}`;
    }
    case "language": {
      const val = SEARCH_PAGE_FILTERS["LANGUAGE_ID_MAP"][rawValue] ?? 0;
      return val === 0 ? void 0 : `${val}`;
    }
    case "sort": {
      return SEARCH_PAGE_FILTERS["SORT_ID_MAP"][rawValue] ?? void 0;
    }
    default:
      return void 0;
  }
}
function getSearchDateFilterValue(isStartDate, rawValue) {
  rawValue = rawValue.trim();
  if (!rawValue) return void 0;
  const dateRegex = /^\d{4}-([0-9]|1[0-2])-([0-9]|[12][0-9]|3[01])$/;
  const dateCategory = isStartDate ? "s" : "e";
  const [year, month, date] = rawValue.split("-");
  if (!dateRegex.test(rawValue)) {
    return void 0;
  }
  return [
    Number(year) > 0 ? `${dateCategory}y=${year}` : "",
    Number(month) > 0 ? `${dateCategory}m=${month}` : "",
    Number(date) > 0 ? `${dateCategory}d=${date}` : ""
  ].filter((d) => Boolean(d));
}
function substringAfter(str, toFind) {
  const index = str.indexOf(toFind);
  return index == -1 ? "" : str.substring(index + toFind.length);
}
function substringBefore(str, toFind) {
  const index = str.indexOf(toFind);
  return index == -1 ? "" : str.substring(0, index);
}

// src/hianime/scrapers/homePage.ts
async function getHomePage() {
  const res = {
    spotlightAnimes: [],
    trendingAnimes: [],
    latestEpisodeAnimes: [],
    topUpcomingAnimes: [],
    top10Animes: {
      today: [],
      week: [],
      month: []
    },
    topAiringAnimes: [],
    mostPopularAnimes: [],
    mostFavoriteAnimes: [],
    latestCompletedAnimes: [],
    genres: []
  };
  try {
    const mainPage = await client.get(SRC_HOME_URL);
    const $ = load(mainPage.data);
    const spotlightSelector = "#slider .swiper-wrapper .swiper-slide";
    $(spotlightSelector).each((_, el) => {
      const otherInfo = $(el).find(".deslide-item-content .sc-detail .scd-item").map((_2, el2) => $(el2).text().trim()).get().slice(0, -1);
      res.spotlightAnimes.push({
        rank: Number(
          $(el).find(".deslide-item-content .desi-sub-text")?.text().trim().split(" ")[0].slice(1)
        ) || null,
        id: $(el).find(".deslide-item-content .desi-buttons a")?.last()?.attr("href")?.slice(1)?.trim() || null,
        name: $(el).find(".deslide-item-content .desi-head-title.dynamic-name")?.text().trim(),
        description: $(el).find(".deslide-item-content .desi-description")?.text()?.split("[")?.shift()?.trim() || null,
        poster: $(el).find(
          ".deslide-cover .deslide-cover-img .film-poster-img"
        )?.attr("data-src")?.trim() || null,
        jname: $(el).find(
          ".deslide-item-content .desi-head-title.dynamic-name"
        )?.attr("data-jname")?.trim() || null,
        episodes: {
          sub: Number(
            $(el).find(
              ".deslide-item-content .sc-detail .scd-item .tick-item.tick-sub"
            )?.text()?.trim()
          ) || null,
          dub: Number(
            $(el).find(
              ".deslide-item-content .sc-detail .scd-item .tick-item.tick-dub"
            )?.text()?.trim()
          ) || null
        },
        type: otherInfo?.[0] || null,
        otherInfo
      });
    });
    const trendingSelector = "#trending-home .swiper-wrapper .swiper-slide";
    $(trendingSelector).each((_, el) => {
      res.trendingAnimes.push({
        rank: parseInt(
          $(el).find(".item .number")?.children()?.first()?.text()?.trim()
        ),
        id: $(el).find(".item .film-poster")?.attr("href")?.slice(1)?.trim() || null,
        name: $(el).find(".item .number .film-title.dynamic-name")?.text()?.trim(),
        jname: $(el).find(".item .number .film-title.dynamic-name")?.attr("data-jname")?.trim() || null,
        poster: $(el).find(".item .film-poster .film-poster-img")?.attr("data-src")?.trim() || null
      });
    });
    const latestEpisodeSelector = "#main-content .block_area_home:nth-of-type(1) .tab-content .film_list-wrap .flw-item";
    res.latestEpisodeAnimes = extractAnimes(
      $,
      latestEpisodeSelector,
      getHomePage.name
    );
    const topUpcomingSelector = "#main-content .block_area_home:nth-of-type(3) .tab-content .film_list-wrap .flw-item";
    res.topUpcomingAnimes = extractAnimes(
      $,
      topUpcomingSelector,
      getHomePage.name
    );
    const genreSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";
    $(genreSelector).each((_, el) => {
      res.genres.push(`${$(el).text().trim()}`);
    });
    const mostViewedSelector = '#main-sidebar .block_area-realtime [id^="top-viewed-"]';
    $(mostViewedSelector).each((_, el) => {
      const period = $(el).attr("id")?.split("-")?.pop()?.trim();
      if (period === "day") {
        res.top10Animes.today = extractTop10Animes(
          $,
          period,
          getHomePage.name
        );
        return;
      }
      if (period === "week") {
        res.top10Animes.week = extractTop10Animes(
          $,
          period,
          getHomePage.name
        );
        return;
      }
      if (period === "month") {
        res.top10Animes.month = extractTop10Animes(
          $,
          period,
          getHomePage.name
        );
      }
    });
    res.topAiringAnimes = extractMostPopularAnimes(
      $,
      "#anime-featured .row div:nth-of-type(1) .anif-block-ul ul li",
      getHomePage.name
    );
    res.mostPopularAnimes = extractMostPopularAnimes(
      $,
      "#anime-featured .row div:nth-of-type(2) .anif-block-ul ul li",
      getHomePage.name
    );
    res.mostFavoriteAnimes = extractMostPopularAnimes(
      $,
      "#anime-featured .row div:nth-of-type(3) .anif-block-ul ul li",
      getHomePage.name
    );
    res.latestCompletedAnimes = extractMostPopularAnimes(
      $,
      "#anime-featured .row div:nth-of-type(4) .anif-block-ul ul li",
      getHomePage.name
    );
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getHomePage.name);
  }
}

// src/hianime/scrapers/animeAZList.ts
import { load as load2 } from "cheerio";
async function getAZList(sortOption, page) {
  const res = {
    sortOption: sortOption.trim(),
    animes: [],
    totalPages: 0,
    hasNextPage: false,
    currentPage: (Number(page) || 0) < 1 ? 1 : Number(page)
  };
  sortOption = res.sortOption;
  page = res.currentPage;
  try {
    if (sortOption === "" || !Boolean(AZ_LIST_SORT_OPTIONS[sortOption])) {
      throw new HiAnimeError(
        "invalid az-list sort option",
        getAZList.name,
        400
      );
    }
    switch (sortOption) {
      case "all":
        sortOption = "";
        break;
      case "other":
        sortOption = "other";
        break;
      default:
        sortOption = sortOption.toUpperCase();
    }
    const azURL = new URL(
      `/az-list/${sortOption}?page=${page}`,
      SRC_BASE_URL
    );
    const resp = await client.get(azURL.href);
    const $ = load2(resp.data);
    const selector = "#main-wrapper .tab-content .film_list-wrap .flw-item";
    res.hasNextPage = $(".pagination > li").length > 0 ? $(".pagination li.active").length > 0 ? $(".pagination > li").last().hasClass("active") ? false : true : false : false;
    res.totalPages = Number(
      $('.pagination > .page-item a[title="Last"]')?.attr("href")?.split("=").pop() ?? $('.pagination > .page-item a[title="Next"]')?.attr("href")?.split("=").pop() ?? $(".pagination > .page-item.active a")?.text()?.trim()
    ) || 1;
    res.animes = extractAnimes($, selector, getAZList.name);
    if (res.animes.length === 0 && !res.hasNextPage) {
      res.totalPages = 0;
    }
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAZList.name);
  }
}

// src/hianime/scrapers/animeGenre.ts
import { load as load3 } from "cheerio";
async function getGenreAnime(genreName, page) {
  const res = {
    // there's a typo with hianime where "martial" arts is "marial" arts
    genreName: genreName === "martial-arts" ? "marial-arts" : genreName.trim(),
    animes: [],
    genres: [],
    topAiringAnimes: [],
    totalPages: 1,
    hasNextPage: false,
    currentPage: (Number(page) || 0) < 1 ? 1 : Number(page)
  };
  genreName = res.genreName;
  page = res.currentPage;
  try {
    if (genreName === "") {
      throw new HiAnimeError(
        "invalid genre name",
        getGenreAnime.name,
        400
      );
    }
    const genreUrl = new URL(
      `/genre/${genreName}?page=${page}`,
      SRC_BASE_URL
    );
    const mainPage = await client.get(genreUrl.href);
    const $ = load3(mainPage.data);
    const selector = "#main-content .tab-content .film_list-wrap .flw-item";
    const genreNameSelector = "#main-content .block_area .block_area-header .cat-heading";
    res.genreName = $(genreNameSelector)?.text()?.trim() ?? genreName;
    res.hasNextPage = $(".pagination > li").length > 0 ? $(".pagination li.active").length > 0 ? $(".pagination > li").last().hasClass("active") ? false : true : false : false;
    res.totalPages = Number(
      $('.pagination > .page-item a[title="Last"]')?.attr("href")?.split("=").pop() ?? $('.pagination > .page-item a[title="Next"]')?.attr("href")?.split("=").pop() ?? $(".pagination > .page-item.active a")?.text()?.trim()
    ) || 1;
    res.animes = extractAnimes($, selector, getGenreAnime.name);
    if (res.animes.length === 0 && !res.hasNextPage) {
      res.totalPages = 0;
    }
    const genreSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";
    $(genreSelector).each((_, el) => {
      res.genres.push(`${$(el).text().trim()}`);
    });
    const topAiringSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-realtime .anif-block-ul ul li";
    res.topAiringAnimes = extractMostPopularAnimes(
      $,
      topAiringSelector,
      getGenreAnime.name
    );
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getGenreAnime.name);
  }
}

// src/hianime/scrapers/animeQtip.ts
import { load as load4 } from "cheerio";
async function getAnimeQtipInfo(animeId) {
  const res = {
    anime: {
      id: animeId.trim(),
      name: null,
      malscore: null,
      quality: null,
      episodes: {
        sub: null,
        dub: null
      },
      type: null,
      description: null,
      jname: null,
      synonyms: null,
      aired: null,
      status: null,
      genres: []
    }
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
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    const $ = load4(mainPage.data);
    const selector = ".pre-qtip-content";
    res.anime.id = $(selector)?.find(".pre-qtip-button a.btn-play")?.attr("href")?.trim()?.split("/")?.pop() || null;
    res.anime.name = $(selector)?.find(".pre-qtip-title")?.text()?.trim() || null;
    res.anime.malscore = $(selector)?.find(".pre-qtip-detail")?.children()?.first()?.text()?.trim() || null;
    res.anime.quality = $(selector)?.find(".tick .tick-quality")?.text()?.trim() || null;
    res.anime.type = $(selector)?.find(".badge.badge-quality")?.text()?.trim() || null;
    res.anime.episodes.sub = Number($(selector)?.find(".tick .tick-sub")?.text()?.trim()) || null;
    res.anime.episodes.dub = Number($(selector)?.find(".tick .tick-dub")?.text()?.trim()) || null;
    res.anime.description = $(selector)?.find(".pre-qtip-description")?.text()?.trim() || null;
    $(`${selector} .pre-qtip-line`).each((_, el) => {
      const key = $(el).find(".stick").text().trim().slice(0, -1).toLowerCase();
      const value = key !== "genres" ? $(el)?.find(".stick-text")?.text()?.trim() || null : $(el)?.text()?.trim()?.slice(key.length + 1);
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
          res.anime.genres = value?.split(",")?.map((i) => i?.trim()) || [];
          break;
      }
    });
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeQtipInfo.name);
  }
}

// src/hianime/scrapers/animeEpisodes.ts
import { load as load5 } from "cheerio";
async function getAnimeEpisodes(animeId) {
  const res = {
    totalEpisodes: 0,
    episodes: []
  };
  try {
    if (animeId.trim() === "" || animeId.indexOf("-") === -1) {
      throw new HiAnimeError(
        "invalid anime id",
        getAnimeEpisodes.name,
        400
      );
    }
    const episodesAjax = await client.get(
      `${SRC_AJAX_URL}/v2/episode/list/${animeId.split("-").pop()}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${SRC_BASE_URL}/watch/${animeId}`
        }
      }
    );
    const $ = load5(episodesAjax.data.html);
    res.totalEpisodes = Number(
      $(".detail-infor-content .ss-list a").length
    );
    $(".detail-infor-content .ss-list a").each((_, el) => {
      res.episodes.push({
        title: $(el)?.attr("title")?.trim() || null,
        episodeId: $(el)?.attr("href")?.split("/")?.pop() || null,
        number: Number($(el).attr("data-number")),
        isFiller: $(el).hasClass("ssl-item-filler")
      });
    });
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeEpisodes.name);
  }
}

// src/hianime/scrapers/animeCategory.ts
import { load as load6 } from "cheerio";
async function getAnimeCategory(category, page) {
  const res = {
    animes: [],
    genres: [],
    top10Animes: {
      today: [],
      week: [],
      month: []
    },
    category,
    totalPages: 0,
    hasNextPage: false,
    currentPage: (Number(page) || 0) < 1 ? 1 : Number(page)
  };
  try {
    if (category.trim() === "") {
      throw new HiAnimeError(
        "invalid anime category",
        getAnimeCategory.name,
        400
      );
    }
    page = res.currentPage;
    const scrapeUrl = new URL(category, SRC_BASE_URL);
    const mainPage = await client.get(`${scrapeUrl}?page=${page}`);
    const $ = load6(mainPage.data);
    const selector = "#main-content .tab-content .film_list-wrap .flw-item";
    const categoryNameSelector = "#main-content .block_area .block_area-header .cat-heading";
    res.category = $(categoryNameSelector)?.text()?.trim() ?? category;
    res.hasNextPage = $(".pagination > li").length > 0 ? $(".pagination li.active").length > 0 ? $(".pagination > li").last().hasClass("active") ? false : true : false : false;
    res.totalPages = Number(
      $('.pagination > .page-item a[title="Last"]')?.attr("href")?.split("=").pop() ?? $('.pagination > .page-item a[title="Next"]')?.attr("href")?.split("=").pop() ?? $(".pagination > .page-item.active a")?.text()?.trim()
    ) || 1;
    res.animes = extractAnimes($, selector, getAnimeCategory.name);
    if (res.animes.length === 0 && !res.hasNextPage) {
      res.totalPages = 0;
    }
    const genreSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";
    $(genreSelector).each((_, el) => {
      res.genres.push(`${$(el).text().trim()}`);
    });
    const top10AnimeSelector = '#main-sidebar .block_area-realtime [id^="top-viewed-"]';
    $(top10AnimeSelector).each((_, el) => {
      const period = $(el).attr("id")?.split("-")?.pop()?.trim();
      if (period === "day") {
        res.top10Animes.today = extractTop10Animes(
          $,
          period,
          getAnimeCategory.name
        );
        return;
      }
      if (period === "week") {
        res.top10Animes.week = extractTop10Animes(
          $,
          period,
          getAnimeCategory.name
        );
        return;
      }
      if (period === "month") {
        res.top10Animes.month = extractTop10Animes(
          $,
          period,
          getAnimeCategory.name
        );
      }
    });
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeCategory.name);
  }
}

// src/hianime/scrapers/animeProducer.ts
import { load as load7 } from "cheerio";
async function getProducerAnimes(producerName, page) {
  const res = {
    producerName,
    animes: [],
    top10Animes: {
      today: [],
      week: [],
      month: []
    },
    topAiringAnimes: [],
    totalPages: 0,
    hasNextPage: false,
    currentPage: (Number(page) || 0) < 1 ? 1 : Number(page)
  };
  try {
    if (producerName.trim() === "") {
      throw new HiAnimeError(
        "invalid producer name",
        getProducerAnimes.name,
        400
      );
    }
    page = res.currentPage;
    const producerUrl = new URL(
      `/producer/${producerName}?page=${page}`,
      SRC_BASE_URL
    );
    const mainPage = await client.get(producerUrl.href);
    const $ = load7(mainPage.data);
    const animeSelector = "#main-content .tab-content .film_list-wrap .flw-item";
    res.hasNextPage = $(".pagination > li").length > 0 ? $(".pagination li.active").length > 0 ? $(".pagination > li").last().hasClass("active") ? false : true : false : false;
    res.totalPages = Number(
      $('.pagination > .page-item a[title="Last"]')?.attr("href")?.split("=").pop() ?? $('.pagination > .page-item a[title="Next"]')?.attr("href")?.split("=").pop() ?? $(".pagination > .page-item.active a")?.text()?.trim()
    ) || 1;
    res.animes = extractAnimes($, animeSelector, getProducerAnimes.name);
    if (res.animes.length === 0 && !res.hasNextPage) {
      res.totalPages = 0;
    }
    const producerNameSelector = "#main-content .block_area .block_area-header .cat-heading";
    res.producerName = $(producerNameSelector)?.text()?.trim() ?? producerName;
    const top10AnimeSelector = '#main-sidebar .block_area-realtime [id^="top-viewed-"]';
    $(top10AnimeSelector).each((_, el) => {
      const period = $(el).attr("id")?.split("-")?.pop()?.trim();
      if (period === "day") {
        res.top10Animes.today = extractTop10Animes(
          $,
          period,
          getProducerAnimes.name
        );
        return;
      }
      if (period === "week") {
        res.top10Animes.week = extractTop10Animes(
          $,
          period,
          getProducerAnimes.name
        );
        return;
      }
      if (period === "month") {
        res.top10Animes.month = extractTop10Animes(
          $,
          period,
          getProducerAnimes.name
        );
      }
    });
    const topAiringSelector = "#main-sidebar .block_area_sidebar:nth-child(2) .block_area-content .anif-block-ul ul li";
    res.topAiringAnimes = extractMostPopularAnimes(
      $,
      topAiringSelector,
      getProducerAnimes.name
    );
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getProducerAnimes.name);
  }
}

// src/hianime/scrapers/episodeServers.ts
import { load as load8 } from "cheerio";
async function getEpisodeServers(episodeId) {
  const res = {
    sub: [],
    dub: [],
    raw: [],
    episodeId,
    episodeNo: 0
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
          Referer: new URL(`/watch/${episodeId}`, SRC_BASE_URL).href
        }
      }
    );
    const $ = load8(data.html);
    const epNoSelector = ".server-notice strong";
    res.episodeNo = Number($(epNoSelector).text().split(" ").pop()) || 0;
    $(`.ps_-block.ps_-block-sub.servers-sub .ps__-list .server-item`).each(
      (_, el) => {
        res.sub.push({
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el)?.attr("data-server-id")?.trim()) || null
        });
      }
    );
    $(`.ps_-block.ps_-block-sub.servers-dub .ps__-list .server-item`).each(
      (_, el) => {
        res.dub.push({
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el)?.attr("data-server-id")?.trim()) || null
        });
      }
    );
    $(`.ps_-block.ps_-block-sub.servers-raw .ps__-list .server-item`).each(
      (_, el) => {
        res.raw.push({
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el)?.attr("data-server-id")?.trim()) || null
        });
      }
    );
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getEpisodeServers.name);
  }
}

// src/hianime/scrapers/animeAboutInfo.ts
import { load as load9 } from "cheerio";
async function getAnimeAboutInfo(animeId) {
  const res = {
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
            dub: null
          },
          type: null,
          duration: null
        },
        promotionalVideos: [],
        charactersVoiceActors: []
      },
      moreInfo: {}
    },
    seasons: [],
    mostPopularAnimes: [],
    relatedAnimes: [],
    recommendedAnimes: []
  };
  try {
    if (animeId.trim() === "" || animeId.indexOf("-") === -1) {
      throw new HiAnimeError(
        "invalid anime id",
        getAnimeAboutInfo.name,
        400
      );
    }
    const animeUrl = new URL(animeId, SRC_BASE_URL);
    const mainPage = await client.get(animeUrl.href);
    const $ = load9(mainPage.data);
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
    const selector = "#ani_detail .container .anis-content";
    res.anime.info.id = $(selector)?.find(".anisc-detail .film-buttons a.btn-play")?.attr("href")?.split("/")?.pop() || null;
    res.anime.info.name = $(selector)?.find(".anisc-detail .film-name.dynamic-name")?.text()?.trim() || null;
    res.anime.info.description = $(selector)?.find(".anisc-detail .film-description .text").text()?.split("[")?.shift()?.trim() || null;
    res.anime.info.poster = $(selector)?.find(".film-poster .film-poster-img")?.attr("src")?.trim() || null;
    res.anime.info.stats.rating = $(`${selector} .film-stats .tick .tick-pg`)?.text()?.trim() || null;
    res.anime.info.stats.quality = $(`${selector} .film-stats .tick .tick-quality`)?.text()?.trim() || null;
    res.anime.info.stats.episodes = {
      sub: Number(
        $(`${selector} .film-stats .tick .tick-sub`)?.text()?.trim()
      ) || null,
      dub: Number(
        $(`${selector} .film-stats .tick .tick-dub`)?.text()?.trim()
      ) || null
    };
    res.anime.info.stats.type = $(`${selector} .film-stats .tick`)?.text()?.trim()?.replace(/[\s\n]+/g, " ")?.split(" ")?.at(-2) || null;
    res.anime.info.stats.duration = $(`${selector} .film-stats .tick`)?.text()?.trim()?.replace(/[\s\n]+/g, " ")?.split(" ")?.pop() || null;
    $(
      ".block_area.block_area-promotions .block_area-promotions-list .screen-items .item"
    ).each((_, el) => {
      res.anime.info.promotionalVideos.push({
        title: $(el).attr("data-title"),
        source: $(el).attr("data-src"),
        thumbnail: $(el).find("img").attr("src")
      });
    });
    $(
      ".block_area.block_area-actors .block-actors-content .bac-list-wrap .bac-item"
    ).each((_, el) => {
      res.anime.info.charactersVoiceActors.push({
        character: {
          id: $(el).find($(".per-info.ltr .pi-avatar")).attr("href")?.split("/")[2] || "",
          poster: $(el).find($(".per-info.ltr .pi-avatar img")).attr("data-src") || "",
          name: $(el).find($(".per-info.ltr .pi-detail a")).text(),
          cast: $(el).find($(".per-info.ltr .pi-detail .pi-cast")).text()
        },
        voiceActor: {
          id: $(el).find($(".per-info.rtl .pi-avatar")).attr("href")?.split("/")[2] || "",
          poster: $(el).find($(".per-info.rtl .pi-avatar img")).attr("data-src") || "",
          name: $(el).find($(".per-info.rtl .pi-detail a")).text(),
          cast: $(el).find($(".per-info.rtl .pi-detail .pi-cast")).text()
        }
      });
    });
    $(`${selector} .anisc-info-wrap .anisc-info .item:not(.w-hide)`).each(
      (_, el) => {
        let key = $(el).find(".item-head").text().toLowerCase().replace(":", "").trim();
        key = key.includes(" ") ? key.replace(" ", "") : key;
        const value = [
          ...$(el).find("*:not(.item-head)").map((_2, el2) => $(el2).text().trim())
        ].map((i) => `${i}`).toString().trim();
        if (key === "genres") {
          res.anime.moreInfo[key] = value.split(",").map((i) => i.trim());
          return;
        }
        if (key === "producers") {
          res.anime.moreInfo[key] = value.split(",").map((i) => i.trim());
          return;
        }
        res.anime.moreInfo[key] = value;
      }
    );
    const seasonsSelector = "#main-content .os-list a.os-item";
    $(seasonsSelector).each((_, el) => {
      res.seasons.push({
        id: $(el)?.attr("href")?.slice(1)?.trim() || null,
        name: $(el)?.attr("title")?.trim() || null,
        title: $(el)?.find(".title")?.text()?.trim(),
        poster: $(el)?.find(".season-poster")?.attr("style")?.split(" ")?.pop()?.split("(")?.pop()?.split(")")[0] || null,
        isCurrent: $(el).hasClass("active")
      });
    });
    const relatedAnimeSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(1) .anif-block-ul ul li";
    res.relatedAnimes = extractMostPopularAnimes(
      $,
      relatedAnimeSelector,
      getAnimeAboutInfo.name
    );
    const mostPopularSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(2) .anif-block-ul ul li";
    res.mostPopularAnimes = extractMostPopularAnimes(
      $,
      mostPopularSelector,
      getAnimeAboutInfo.name
    );
    const recommendedAnimeSelector = "#main-content .block_area.block_area_category .tab-content .flw-item";
    res.recommendedAnimes = extractAnimes(
      $,
      recommendedAnimeSelector,
      getAnimeAboutInfo.name
    );
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeAboutInfo.name);
  }
}

// src/hianime/scrapers/animeSearch.ts
import { load as load10 } from "cheerio";
var searchFilters = {
  filter: true,
  type: true,
  status: true,
  rated: true,
  score: true,
  season: true,
  language: true,
  start_date: true,
  end_date: true,
  sort: true,
  genres: true
};
async function _getAnimeSearchResults(q, page = 1, filters) {
  try {
    const res = {
      animes: [],
      mostPopularAnimes: [],
      searchQuery: q,
      searchFilters: filters,
      totalPages: 0,
      hasNextPage: false,
      currentPage: (Number(page) || 0) < 1 ? 1 : Number(page)
    };
    const url = new URL(SRC_SEARCH_URL);
    url.searchParams.set("keyword", q);
    url.searchParams.set("page", `${res.currentPage}`);
    url.searchParams.set("sort", "default");
    for (const key in filters) {
      if (key.includes("_date")) {
        const dates = getSearchDateFilterValue(
          key === "start_date",
          filters[key] || ""
        );
        if (!dates) continue;
        dates.map((dateParam) => {
          const [key2, val] = dateParam.split("=");
          url.searchParams.set(key2, val);
        });
        continue;
      }
      const filterVal = getSearchFilterValue(
        key,
        filters[key] || ""
      );
      filterVal && url.searchParams.set(key, filterVal);
    }
    const mainPage = await client.get(url.href);
    const $ = load10(mainPage.data);
    const selector = "#main-content .tab-content .film_list-wrap .flw-item";
    res.hasNextPage = $(".pagination > li").length > 0 ? $(".pagination li.active").length > 0 ? $(".pagination > li").last().hasClass("active") ? false : true : false : false;
    res.totalPages = Number(
      $('.pagination > .page-item a[title="Last"]')?.attr("href")?.split("=").pop() ?? $('.pagination > .page-item a[title="Next"]')?.attr("href")?.split("=").pop() ?? $(".pagination > .page-item.active a")?.text()?.trim()
    ) || 1;
    res.animes = extractAnimes($, selector, getAnimeSearchResults.name);
    if (res.animes.length === 0 && !res.hasNextPage) {
      res.totalPages = 0;
    }
    const mostPopularSelector = "#main-sidebar .block_area.block_area_sidebar.block_area-realtime .anif-block-ul ul li";
    res.mostPopularAnimes = extractMostPopularAnimes(
      $,
      mostPopularSelector,
      getAnimeSearchResults.name
    );
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeSearchResults.name);
  }
}
async function getAnimeSearchResults(q, page, filters) {
  try {
    q = q.trim() ? decodeURIComponent(q.trim()) : "";
    if (q.trim() === "") {
      throw new HiAnimeError(
        "invalid search query",
        getAnimeSearchResults.name,
        400
      );
    }
    page = page < 1 ? 1 : page;
    const parsedFilters = {};
    for (const key in filters) {
      if (searchFilters[key]) {
        parsedFilters[key] = filters[key];
      }
    }
    return _getAnimeSearchResults(q, page, parsedFilters);
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeSearchResults.name);
  }
}

// src/hianime/scrapers/animeEpisodeSrcs.ts
import axios6 from "axios";
import { load as load13 } from "cheerio";

// src/extractors/streamsb.ts
import axios2 from "axios";
var StreamSB = class {
  // private serverName = "streamSB";
  sources = [];
  host = "https://watchsb.com/sources50";
  host2 = "https://streamsss.net/sources16";
  PAYLOAD(hex) {
    return `566d337678566f743674494a7c7c${hex}7c7c346b6767586d6934774855537c7c73747265616d7362/6565417268755339773461447c7c346133383438333436313335376136323337373433383634376337633465366534393338373136643732373736343735373237613763376334363733353737303533366236333463353333363534366137633763373337343732363536313664373336327c7c6b586c3163614468645a47617c7c73747265616d7362`;
  }
  async extract(videoUrl, isAlt = false) {
    let headers = {
      watchsb: "sbstream",
      Referer: videoUrl.href,
      "User-Agent": USER_AGENT_HEADER
    };
    let id = videoUrl.href.split("/e/").pop();
    if (id?.includes("html")) {
      id = id.split(".html")[0];
    }
    const bytes = new TextEncoder().encode(id);
    const res = await axios2.get(
      `${isAlt ? this.host2 : this.host}/${this.PAYLOAD(
        Buffer.from(bytes).toString("hex")
      )}`,
      { headers }
    ).catch(() => null);
    if (!res?.data.stream_data) {
      throw new Error("No source found. Try a different server");
    }
    headers = {
      "User-Agent": USER_AGENT_HEADER,
      Referer: videoUrl.href.split("e/")[0]
    };
    const m3u8_urls = await axios2.get(res.data.stream_data.file, {
      headers
    });
    const videoList = m3u8_urls?.data?.split("#EXT-X-STREAM-INF:") ?? [];
    for (const video of videoList) {
      if (!video.includes("m3u8")) continue;
      const url = video.split("\n")[1];
      const quality = video.split("RESOLUTION=")[1].split(",")[0].split("x")[1];
      this.sources.push({
        url,
        quality: `${quality}p`,
        isM3U8: true
      });
    }
    this.sources.push({
      url: res.data.stream_data.file,
      quality: "auto",
      isM3U8: res.data.stream_data.file.includes(".m3u8")
    });
    return this.sources;
  }
  // private addSources(source: any): void {
  //   this.sources.push({
  //     url: source.file,
  //     isM3U8: source.file.includes(".m3u8"),
  //   });
  // }
};
var streamsb_default = StreamSB;

// src/extractors/streamtape.ts
import axios3 from "axios";
import { load as load11 } from "cheerio";
var StreamTape = class {
  // private serverName = "StreamTape";
  sources = [];
  async extract(videoUrl) {
    try {
      const { data } = await axios3.get(videoUrl.href).catch(() => {
        throw new Error("Video not found");
      });
      const $ = load11(data);
      let [fh, sh] = $.html()?.match(/robotlink'\).innerHTML = (.*)'/)[1].split("+ ('");
      sh = sh.substring(3);
      fh = fh.replace(/\'/g, "");
      const url = `https:${fh}${sh}`;
      this.sources.push({
        url,
        isM3U8: url.includes(".m3u8")
      });
      return this.sources;
    } catch (err) {
      throw new Error(err.message);
    }
  }
};
var streamtape_default = StreamTape;

// src/extractors/rapidcloud.ts
import axios4 from "axios";
import CryptoJS from "crypto-js";
var RapidCloud = class {
  // private serverName = "RapidCloud";
  sources = [];
  // https://rapid-cloud.co/embed-6/eVZPDXwVfrY3?vast=1
  fallbackKey = "c1d17096f2ca11b7";
  host = "https://rapid-cloud.co";
  async extract(videoUrl) {
    const result = {
      sources: [],
      subtitles: []
    };
    try {
      const id = videoUrl.href.split("/").pop()?.split("?")[0];
      const options = {
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      };
      let res = null;
      res = await axios4.get(
        `https://${videoUrl.hostname}/embed-2/ajax/e-1/getSources?id=${id}`,
        options
      );
      let {
        data: { sources, tracks, intro, outro, encrypted }
      } = res;
      let decryptKey = await (await axios4.get(
        "https://raw.githubusercontent.com/cinemaxhq/keys/e1/key"
      )).data;
      decryptKey = substringBefore(
        substringAfter(
          decryptKey,
          '"blob-code blob-code-inner js-file-line">'
        ),
        "</td>"
      );
      if (!decryptKey) {
        decryptKey = await (await axios4.get(
          "https://raw.githubusercontent.com/cinemaxhq/keys/e1/key"
        )).data;
      }
      if (!decryptKey) decryptKey = this.fallbackKey;
      try {
        if (encrypted) {
          const sourcesArray = sources.split("");
          let extractedKey = "";
          let currentIndex = 0;
          for (const index of decryptKey) {
            const start = index[0] + currentIndex;
            const end = start + index[1];
            for (let i = start; i < end; i++) {
              extractedKey += res.data.sources[i];
              sourcesArray[i] = "";
            }
            currentIndex += index[1];
          }
          decryptKey = extractedKey;
          sources = sourcesArray.join("");
          const decrypt = CryptoJS.AES.decrypt(sources, decryptKey);
          sources = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
        }
      } catch (err) {
        log.info(err.message);
        throw new Error(
          "Cannot decrypt sources. Perhaps the key is invalid."
        );
      }
      this.sources = sources?.map((s) => ({
        url: s.file,
        isM3U8: s.file.includes(".m3u8")
      }));
      result.sources.push(...this.sources);
      if (videoUrl.href.includes(new URL(this.host).host)) {
        result.sources = [];
        this.sources = [];
        for (const source of sources) {
          const { data } = await axios4.get(source.file, options);
          const m3u8data = data.split("\n").filter(
            (line) => line.includes(".m3u8") && line.includes("RESOLUTION=")
          );
          const secondHalf = m3u8data.map(
            (line) => line.match(/RESOLUTION=.*,(C)|URI=.*/g)?.map((s) => s.split("=")[1])
          );
          const TdArray = secondHalf.map((s) => {
            const f1 = s[0].split(",C")[0];
            const f2 = s[1].replace(/"/g, "");
            return [f1, f2];
          });
          for (const [f1, f2] of TdArray) {
            this.sources.push({
              url: `${source.file?.split("master.m3u8")[0]}${f2.replace(
                "iframes",
                "index"
              )}`,
              quality: f1.split("x")[1] + "p",
              isM3U8: f2.includes(".m3u8")
            });
          }
          result.sources.push(...this.sources);
        }
      }
      result.intro = intro?.end > 1 ? { start: intro.start, end: intro.end } : void 0;
      result.outro = outro?.end > 1 ? { start: outro.start, end: outro.end } : void 0;
      result.sources.push({
        url: sources[0].file,
        isM3U8: sources[0].file.includes(".m3u8"),
        quality: "auto"
      });
      result.subtitles = tracks.map(
        (s) => s.file ? {
          url: s.file,
          lang: s.label ? s.label : "Thumbnails"
        } : null
      ).filter((s) => s);
      return result;
    } catch (err) {
      log.info(err.message);
      throw err;
    }
  }
};
var rapidcloud_default = RapidCloud;

// src/extractors/megacloud.ts
import axios5 from "axios";
import crypto from "crypto";
import CryptoJS2 from "crypto-js";
import * as cheerio from "cheerio";
var megacloud = {
  script: "https://megacloud.tv/js/player/a/prod/e1-player.min.js?v=",
  sources: "https://megacloud.tv/embed-2/ajax/e-1/getSources?id="
};
var MegaCloud = class {
  // private serverName = "megacloud";
  async extract(videoUrl) {
    try {
      const extractedData = {
        tracks: [],
        intro: {
          start: 0,
          end: 0
        },
        outro: {
          start: 0,
          end: 0
        },
        sources: []
      };
      const videoId = videoUrl?.href?.split("/")?.pop()?.split("?")[0];
      const { data: srcsData } = await axios5.get(
        megacloud.sources.concat(videoId || ""),
        {
          headers: {
            Accept: "*/*",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            Referer: videoUrl.href
          }
        }
      );
      if (!srcsData) {
        throw new HiAnimeError(
          "Url may have an invalid video id",
          "getAnimeEpisodeSources",
          400
        );
      }
      const encryptedString = srcsData.sources;
      if (!srcsData.encrypted && Array.isArray(encryptedString)) {
        extractedData.intro = srcsData.intro;
        extractedData.outro = srcsData.outro;
        extractedData.tracks = srcsData.tracks;
        extractedData.sources = encryptedString.map((s) => ({
          url: s.file,
          type: s.type
        }));
        return extractedData;
      }
      let text;
      const { data } = await axios5.get(
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
        encryptedString,
        vars
      );
      const decrypted = this.decrypt(encryptedSource, secret);
      try {
        const sources = JSON.parse(decrypted);
        extractedData.intro = srcsData.intro;
        extractedData.outro = srcsData.outro;
        extractedData.tracks = srcsData.tracks;
        extractedData.sources = sources.map((s) => ({
          url: s.file,
          type: s.type
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
      throw err;
    }
  }
  extractVariables(text) {
    const regex = /case\s*0x[0-9a-f]+:(?![^;]*=partKey)\s*\w+\s*=\s*(\w+)\s*,\s*\w+\s*=\s*(\w+);/g;
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
  getSecret(encryptedString, values) {
    let secret = "", encryptedSource = "", encryptedSourceArray = encryptedString.split(""), currentIndex = 0;
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
  decrypt(encrypted, keyOrSecret, maybe_iv) {
    let key;
    let iv;
    let contents;
    if (maybe_iv) {
      key = keyOrSecret;
      iv = maybe_iv;
      contents = encrypted;
    } else {
      const cypher = Buffer.from(encrypted, "base64");
      const salt = cypher.subarray(8, 16);
      const password = Buffer.concat([
        Buffer.from(keyOrSecret, "binary"),
        salt
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
    const decrypted = decipher.update(
      contents,
      typeof contents === "string" ? "base64" : void 0,
      "utf8"
    ) + decipher.final();
    return decrypted;
  }
  // function copied from github issue #30 'https://github.com/ghoshRitesh12/aniwatch-api/issues/30'
  matchingKey(value, script) {
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
  async extract3(embedIframeURL) {
    try {
      const response = await axios5.get(
        "https://raw.githubusercontent.com/itzzzme/megacloud-keys/refs/heads/main/key.txt"
      );
      const key = response.data;
      const extractedData = {
        tracks: [],
        intro: {
          start: 0,
          end: 0
        },
        outro: {
          start: 0,
          end: 0
        },
        sources: []
      };
      const match = /\/([^\/\?]+)\?/.exec(embedIframeURL.href);
      const sourceId = match?.[1];
      if (!sourceId)
        throw new Error("Unable to extract sourceId from embed URL");
      const megacloudUrl = `https://megacloud.blog/embed-2/v2/e-1/getSources?id=${sourceId}`;
      const { data: rawSourceData } = await axios5.get(megacloudUrl);
      const encrypted = rawSourceData?.sources;
      if (!encrypted)
        throw new Error("Encrypted source missing in response");
      const decrypted = CryptoJS2.AES.decrypt(encrypted, key).toString(
        CryptoJS2.enc.Utf8
      );
      let decryptedSources;
      try {
        decryptedSources = JSON.parse(decrypted);
      } catch (e) {
        throw new Error("Decrypted data is not valid JSON");
      }
      extractedData.intro = rawSourceData.intro ? rawSourceData.intro : extractedData.intro;
      extractedData.outro = rawSourceData.outro ? rawSourceData.outro : extractedData.outro;
      extractedData.tracks = rawSourceData.tracks?.map((track) => ({
        url: track.file,
        lang: track.label ? track.label : track.kind
      })) || [];
      extractedData.sources = decryptedSources.map((s) => ({
        url: s.file,
        isM3U8: s.type === "hls",
        type: s.type
      }));
      return extractedData;
    } catch (err) {
      throw err;
    }
  }
  async extract4(embedIframeURL, category) {
    const extractedData = {
      tracks: [],
      intro: {
        start: 0,
        end: 0
      },
      outro: {
        start: 0,
        end: 0
      },
      sources: []
    };
    const epId = embedIframeURL.split("?ep=")[1];
    const iframe = await fetch(
      `https://megaplay.buzz/stream/s-2/${epId}/${category}`,
      {
        headers: {
          Host: "megaplay.buzz",
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
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
          TE: "trailers"
        }
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
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
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
          TE: "trailers"
        }
      }
    );
    const sourcesJson = await sources.json();
    extractedData.intro = sourcesJson.intro;
    extractedData.outro = sourcesJson.outro;
    extractedData.tracks = sourcesJson.tracks?.map((track) => ({
      url: track.file,
      lang: track.label ? track.label : track.kind
    })) || [];
    extractedData.sources = [
      {
        url: sourcesJson.sources.file,
        type: "hls"
      }
    ];
    return extractedData;
  }
};
var megacloud_default = MegaCloud;

// src/hianime/types/anime.ts
var Servers = /* @__PURE__ */ ((Servers2) => {
  Servers2["VidStreaming"] = "hd-1";
  Servers2["MegaCloud"] = "megacloud";
  Servers2["StreamSB"] = "streamsb";
  Servers2["StreamTape"] = "streamtape";
  Servers2["VidCloud"] = "hd-2";
  Servers2["AsianLoad"] = "asianload";
  Servers2["GogoCDN"] = "gogocdn";
  Servers2["MixDrop"] = "mixdrop";
  Servers2["UpCloud"] = "upcloud";
  Servers2["VizCloud"] = "vizcloud";
  Servers2["MyCloud"] = "mycloud";
  Servers2["Filemoon"] = "filemoon";
  return Servers2;
})(Servers || {});

// src/hianime/scrapers/animeEpisodeSrcs.ts
async function _getAnimeEpisodeSources(episodeId, server = "hd-1" /* VidStreaming */, category = "sub") {
  if (episodeId.startsWith("http")) {
    const serverUrl = new URL(episodeId);
    switch (server) {
      case "hd-1" /* VidStreaming */:
      case "hd-2" /* VidCloud */:
        return {
          headers: { Referer: `${serverUrl.origin}/` },
          // disabled for the timebeing
          // ...(await new MegaCloud().extract(serverUrl)),
          // disabled again for the timebeing
          // ...(await new MegaCloud().extract2(serverUrl)),
          ...await new megacloud_default().extract3(serverUrl)
        };
      case "streamsb" /* StreamSB */:
        return {
          headers: {
            Referer: serverUrl.href,
            watchsb: "streamsb",
            "User-Agent": USER_AGENT_HEADER
          },
          sources: await new streamsb_default().extract(serverUrl, true)
        };
      case "streamtape" /* StreamTape */:
        return {
          headers: {
            Referer: serverUrl.href,
            "User-Agent": USER_AGENT_HEADER
          },
          sources: await new streamtape_default().extract(serverUrl)
        };
      default:
        return {
          headers: { Referer: serverUrl.href },
          ...await new rapidcloud_default().extract(serverUrl)
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
          "X-Requested-With": "XMLHttpRequest"
        }
      }
    );
    const $ = load13(resp.data.html);
    let serverId = null;
    try {
      log.info(`THE SERVER: ${JSON.stringify(server)}`);
      switch (server) {
        case "hd-1" /* VidStreaming */:
        case "hd-2" /* VidCloud */: {
          return {
            headers: { Referer: `https://megaplay.buzz/stream/s-2/${episodeId}/${category}` },
            ...await new megacloud_default().extract4(episodeId, category)
          };
        }
        case "streamsb" /* StreamSB */: {
          serverId = retrieveServerId($, 5, category);
          if (!serverId) throw new Error("StreamSB not found");
          break;
        }
        case "streamtape" /* StreamTape */: {
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
      data: { link }
    } = await client.get(
      `${SRC_AJAX_URL}/v2/episode/sources?id=${serverId}`
    );
    log.info(`THE LINK: ${link}`);
    return await _getAnimeEpisodeSources(link, server);
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeEpisodeSources.name);
  }
}
async function getAnimeEpisodeSources(episodeId, server, category) {
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
    let malID;
    let anilistID;
    const animeURL = new URL(episodeId?.split("?ep=")[0], SRC_BASE_URL)?.href;
    const [episodeSrcData, animeSrc] = await Promise.all([
      _getAnimeEpisodeSources(episodeId, server, category),
      axios6.get(animeURL, {
        headers: {
          Referer: SRC_BASE_URL,
          "User-Agent": USER_AGENT_HEADER,
          "X-Requested-With": "XMLHttpRequest"
        }
      })
    ]);
    log.info(`EPISODE_SRC_DATA: ${JSON.stringify(episodeSrcData)}`);
    const $ = load13(animeSrc?.data);
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
      malID
    };
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeEpisodeSources.name);
  }
}

// src/hianime/scrapers/animeSearchSuggestion.ts
import { load as load14 } from "cheerio";
async function getAnimeSearchSuggestion(q) {
  try {
    const res = {
      suggestions: []
    };
    q = q.trim() ? decodeURIComponent(q.trim()) : "";
    if (q.trim() === "") {
      throw new HiAnimeError(
        "invalid search query",
        getAnimeSearchSuggestion.name,
        400
      );
    }
    const { data } = await client.get(
      `${SRC_AJAX_URL}/search/suggest?keyword=${encodeURIComponent(q)}`,
      {
        headers: {
          Accept: "*/*",
          Pragma: "no-cache",
          Referer: SRC_HOME_URL,
          "X-Requested-With": "XMLHttpRequest"
        }
      }
    );
    const $ = load14(data.html);
    const selector = ".nav-item:has(.film-poster)";
    if ($(selector).length < 1) return res;
    $(selector).each((_, el) => {
      const id = $(el).attr("href")?.split("?")[0].includes("javascript") ? null : $(el).attr("href")?.split("?")[0]?.slice(1) || null;
      res.suggestions.push({
        id,
        name: $(el).find(".srp-detail .film-name")?.text()?.trim() || null,
        jname: $(el).find(".srp-detail .film-name")?.attr("data-jname")?.trim() || $(el).find(".srp-detail .alias-name")?.text()?.trim() || null,
        poster: $(el).find(".film-poster .film-poster-img")?.attr("data-src")?.trim() || null,
        moreInfo: [
          ...$(el).find(".film-infor").contents().map((_2, el2) => $(el2).text().trim())
        ].filter((i) => i)
      });
    });
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getAnimeSearchSuggestion.name);
  }
}

// src/hianime/scrapers/estimatedSchedule.ts
import { load as load15 } from "cheerio";
async function getEstimatedSchedule(date, tzOffset = -330) {
  const res = {
    scheduledAnimes: []
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
    const estScheduleURL = `${SRC_AJAX_URL}/schedule/list?tzOffset=${tzOffset}&date=${date}`;
    const mainPage = await client.get(estScheduleURL, {
      headers: {
        Accept: "*/*",
        Referer: SRC_HOME_URL,
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    const $ = load15(mainPage?.data?.html);
    const selector = "li";
    if ($(selector)?.text()?.trim()?.includes("No data to display")) {
      return res;
    }
    $(selector).each((_, el) => {
      const airingTimestamp = (/* @__PURE__ */ new Date(
        `${date}T${$(el)?.find("a .time")?.text()?.trim()}:00`
      )).getTime();
      res.scheduledAnimes.push({
        id: $(el)?.find("a")?.attr("href")?.slice(1)?.trim() || null,
        time: $(el)?.find("a .time")?.text()?.trim() || null,
        name: $(el)?.find("a .film-name.dynamic-name")?.text()?.trim() || null,
        jname: $(el)?.find("a .film-name.dynamic-name")?.attr("data-jname")?.trim() || null,
        airingTimestamp,
        secondsUntilAiring: Math.floor(
          (airingTimestamp - Date.now()) / 1e3
        ),
        episode: Number(
          $(el).find("a .fd-play button").text().trim().split(" ")[1]
        )
      });
    });
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getEstimatedSchedule.name);
  }
}
async function getNextEpisodeSchedule(animeId) {
  const res = {
    airingISOTimestamp: null,
    airingTimestamp: null,
    secondsUntilAiring: null
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
    const animeUrl = `${SRC_BASE_URL}/watch/${animeId}`;
    const mainPage = await client.get(animeUrl, {
      headers: {
        Accept: "*/*",
        Referer: SRC_HOME_URL
      }
    });
    const $ = load15(mainPage.data);
    const selector = ".schedule-alert > .alert.small > span:last";
    const timestamp = String(
      $(selector).attr("data-value")?.trim() || null
    );
    const schedule = new Date(timestamp);
    if (isNaN(schedule.getTime())) return res;
    res.airingISOTimestamp = schedule.toISOString();
    res.airingTimestamp = schedule.getTime();
    res.secondsUntilAiring = Math.floor(
      (res.airingTimestamp - Date.now()) / 1e3
    );
    return res;
  } catch (err) {
    throw HiAnimeError.wrapError(err, getNextEpisodeSchedule.name);
  }
}

// src/hianime/hianime.ts
var Scraper = class {
  /**
   * @param {string} animeId - unique anime id
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getInfo("steinsgate-3")
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getInfo(animeId) {
    return getAnimeAboutInfo(animeId);
  }
  /**
   * @param {string} category - anime category
   * @param {number} page - page number, defaults to `1`
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getCategoryAnime("subbed-anime")
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getCategoryAnime(category, page = 1) {
    return getAnimeCategory(category, page);
  }
  /**
   * @param {string} animeId - unique anime id
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getEpisodes("steinsgate-3")
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getEpisodes(animeId) {
    return getAnimeEpisodes(animeId);
  }
  /**
   * @param {string} episodeId - unique episode id
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getEpisodeSources("steinsgate-3?ep=230", "hd-1", "sub")
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getEpisodeSources(episodeId, server = "hd-1" /* VidStreaming */, category = "sub") {
    return getAnimeEpisodeSources(episodeId, server, category);
  }
  /**
   * @param {string} genreName - anime genre name
   * @param {number} page - page number, defaults to `1`
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getGenreAnime("shounen", 2)
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getGenreAnime(genreName, page = 1) {
    return getGenreAnime(genreName, page);
  }
  /**
   * @param {string} producerName - anime producer name
   * @param {number} page - page number, defaults to `1`
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getProducerAnimes("toei-animation", 2)
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getProducerAnimes(producerName, page = 1) {
    return getProducerAnimes(producerName, page);
  }
  /**
   * @param {string} q - search query
   * @param {number} page - page number, defaults to `1`
   * @param {SearchFilters} filters - optional advance search filters
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper();
   *
   * hianime
   *   .search("monster", 1, {
   *     genres: "seinen,psychological",
   *   })
   *   .then((data) => {
   *     console.log(data);
   *   })
   *   .catch((err) => {
   *     console.error(err);
   *   });
   *
   */
  async search(q, page = 1, filters = {}) {
    return getAnimeSearchResults(q, page, filters);
  }
  /**
   * @param {string} q - search query
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.searchSuggestions("one piece")
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async searchSuggestions(q) {
    return getAnimeSearchSuggestion(q);
  }
  /**
   * @param {string} animeEpisodeId - unique anime episode id
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getEpisodeServers("steinsgate-0-92?ep=2055")
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getEpisodeServers(animeEpisodeId) {
    return getEpisodeServers(animeEpisodeId);
  }
  /**
   * @param {string} date - date in `YYYY-MM-DD` format
   * @param {number} tzOffset - timezone offset in minutes, defaults to `-330` (IST)
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   * const timezoneOffset = -330; // IST offset in minutes
   *
   * hianime.getEstimatedSchedule("2025-06-09", timezoneOffset)
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getEstimatedSchedule(date, tzOffset = -330) {
    return getEstimatedSchedule(date, tzOffset);
  }
  /**
   * @param {string} animeId - unique anime id
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getNextEpisodeSchedule("one-piece-100")
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getNextEpisodeSchedule(animeId) {
    return getNextEpisodeSchedule(animeId);
  }
  /**
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getHomePage()
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getHomePage() {
    return getHomePage();
  }
  /**
   * @param {AZListSortOptions} sortOption az-list sort option
   * @param {number} page - page number, defaults to `1`
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getAZList("0-9", 1)
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getAZList(sortOption, page = 1) {
    return getAZList(sortOption, page);
  }
  /**
   * @param {string} animeId - unique anime id
   * @throws {HiAnimeError}
   * @example
   * import { HiAnime } from "aniwatch";
   *
   * const hianime = new HiAnime.Scraper()
   *
   * hianime.getQtipInfo("one-piece-100")
   *  .then((data) => console.log(data))
   *  .catch((err) => console.error(err));
   *
   */
  async getQtipInfo(animeId) {
    return getAnimeQtipInfo(animeId);
  }
};
export {
  hianime_exports as HiAnime,
  HiAnimeError
};
