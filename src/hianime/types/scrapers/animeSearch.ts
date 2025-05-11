import type {
    ScrapedAnimeCategory,
    CommonAnimeScrapeTypes,
} from "./animeCategory.js";
import type { MostPopularAnime } from "../anime.js";
import type { SearchFilters } from "../animeSearch.js";

export type ScrapedAnimeSearchResult = Pick<
    ScrapedAnimeCategory,
    CommonAnimeScrapeTypes
> & {
    mostPopularAnimes: MostPopularAnime[];
    searchQuery: string;
    searchFilters: SearchFilters;
};
