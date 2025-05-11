import type { AZListSortOptions } from "../anime.js";
import type {
    ScrapedAnimeCategory,
    CommonAnimeScrapeTypes,
} from "./animeCategory.js";

export type ScrapedAnimeAZList = Pick<
    ScrapedAnimeCategory,
    CommonAnimeScrapeTypes
> & {
    sortOption: AZListSortOptions;
};
