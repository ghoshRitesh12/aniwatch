import { type AnimeEpisode } from "../anime.js";

export type ScrapedAnimeEpisodes = {
    totalEpisodes: number;
    episodes: AnimeEpisode[];
};
