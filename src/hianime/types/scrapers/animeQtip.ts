import type { Anime } from "../anime.js";

export type ScrapedAnimeQtipInfo = {
    anime: {
        quality: string | null;
        genres: string[];
        aired: string | null;
        synonyms: string | null;
        status: string | null;
        malscore: string | null;
        description: string | null;
    } & Omit<Anime, "poster" | "duration" | "rating">;
};
