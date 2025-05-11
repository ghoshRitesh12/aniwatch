import {
    type Season,
    type RelatedAnime,
    type RecommendedAnime,
    type AnimeGeneralAboutInfo,
} from "../anime.js";
import { type ScrapedAnimeSearchResult } from "./animeSearch.js";

export type ScrapedAnimeAboutInfo = Pick<
    ScrapedAnimeSearchResult,
    "mostPopularAnimes"
> & {
    anime: {
        info: AnimeGeneralAboutInfo;
        moreInfo: Record<string, string | string[]>;
    };
    seasons: Season[];
    relatedAnimes: RelatedAnime[];
    recommendedAnimes: RecommendedAnime[];
};
