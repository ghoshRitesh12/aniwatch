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

export interface ScrapedHomePage
  extends Pick<ScrapedAnimeCategory, "genres" | "top10Animes"> {
  spotlightAnimes: Array<SpotlightAnime>;
  trendingAnimes: Array<TrendingAnime>;
  latestEpisodeAnimes: Array<LatestEpisodeAnime>;
  topUpcomingAnimes: Array<TopUpcomingAnime>;
  topAiringAnimes: Array<TopAiringAnime>;
  mostPopularAnimes: Array<MostPopularAnime>;
  mostFavoriteAnimes: Array<MostFavoriteAnime>;
  latestCompletedAnimes: Array<LatestCompletedAnime>;
}
