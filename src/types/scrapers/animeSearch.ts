import type {
  ScrapedAnimeCategory,
  CommonAnimeScrapeTypes,
} from "./animeCategory.js";
import type { MostPopularAnime } from "../anime.js";
import type { SearchFilters } from "../animeSearch.js";

export interface ScrapedAnimeSearchResult
  extends Pick<ScrapedAnimeCategory, CommonAnimeScrapeTypes> {
  mostPopularAnimes: Array<MostPopularAnime>;
  searchQuery: string;
  searchFilters: SearchFilters;
}
