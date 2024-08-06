import type { Anime, Top10Anime } from "../anime.js";

export interface ScrapedAnimeCategory {
  animes: Array<Anime>;
  genres: Array<string>;
  top10Animes: {
    today: Array<Top10Anime>;
    week: Array<Top10Anime>;
    month: Array<Top10Anime>;
  };
  category: string;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
}

export type CommonAnimeScrapeTypes =
  | "animes"
  | "totalPages"
  | "hasNextPage"
  | "currentPage";
