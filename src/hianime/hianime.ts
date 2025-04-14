import {
    getAZList,
    getHomePage,
    getGenreAnime,
    getAnimeQtipInfo,
    getAnimeEpisodes,
    getAnimeCategory,
    getAnimeAboutInfo,
    getEpisodeServers,
    getProducerAnimes,
    getEstimatedSchedule,
    getAnimeSearchResults,
    getAnimeEpisodeSources,
    getNextEpisodeSchedule,
    getAnimeSearchSuggestion,
} from "./scrapers/index.js";

import {
    Servers,
    type AnimeServers,
    type AnimeCategories,
    type AZListSortOptions,
} from "./types/anime.js";
import type { SearchFilters } from "./types/animeSearch.js";

class Scraper {
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
    async getInfo(animeId: string) {
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
    async getCategoryAnime(category: AnimeCategories, page: number = 1) {
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
    async getEpisodes(animeId: string) {
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
    async getEpisodeSources(
        episodeId: string,
        server: AnimeServers = Servers.VidStreaming,
        category: "sub" | "dub" | "raw" = "sub"
    ) {
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
    async getGenreAnime(genreName: string, page: number = 1) {
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
    async getProducerAnimes(producerName: string, page: number = 1) {
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
    async search(q: string, page: number = 1, filters: SearchFilters = {}) {
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
    async searchSuggestions(q: string) {
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
    async getEpisodeServers(animeEpisodeId: string) {
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
    async getEstimatedSchedule(date: string, tzOffset: number = -330) {
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
    async getNextEpisodeSchedule(animeId: string) {
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
    async getAZList(sortOption: AZListSortOptions, page: number = 1) {
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
    async getQtipInfo(animeId: string) {
        return getAnimeQtipInfo(animeId);
    }
}

export { Scraper };
export {
    SEARCH_PAGE_FILTERS,
    AZ_LIST_SORT_OPTIONS,
} from "../utils/constants.js";
export * from "./types/anime.js";
export * from "./types/animeSearch.js";
export * from "./types/scrapers/index.js";
