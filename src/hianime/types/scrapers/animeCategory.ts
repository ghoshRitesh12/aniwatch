import type { Anime, Top10Anime } from "../anime.js";

export type ScrapedAnimeCategory = {
    animes: Anime[];
    genres: string[];
    top10Animes: {
        today: Top10Anime[];
        week: Top10Anime[];
        month: Top10Anime[];
    };
    category: string;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
};

export type CommonAnimeScrapeTypes =
    | "animes"
    | "totalPages"
    | "hasNextPage"
    | "currentPage";
