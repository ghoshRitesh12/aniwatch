import type {
    TrendingAnime,
    SpotlightAnime,
    TopAiringAnime,
    TopUpcomingAnime,
    LatestEpisodeAnime,
    MostFavoriteAnime,
    MostPopularAnime,
    LatestCompletedAnime,
} from "../anime.js";
import type { ScrapedAnimeCategory } from "./animeCategory.js";

export type ScrapedHomePage = Pick<
    ScrapedAnimeCategory,
    "genres" | "top10Animes"
> & {
    spotlightAnimes: SpotlightAnime[];
    trendingAnimes: TrendingAnime[];
    latestEpisodeAnimes: LatestEpisodeAnime[];
    topUpcomingAnimes: TopUpcomingAnime[];
    topAiringAnimes: TopAiringAnime[];
    mostPopularAnimes: MostPopularAnime[];
    mostFavoriteAnimes: MostFavoriteAnime[];
    latestCompletedAnimes: LatestCompletedAnime[];
};
