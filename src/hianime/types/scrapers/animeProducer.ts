import type { ScrapedHomePage } from "./homePage.js";
import type { ScrapedAnimeCategory } from "./animeCategory.js";

export type ScrapedProducerAnime = Omit<
    ScrapedAnimeCategory,
    "genres" | "category"
> &
    Pick<ScrapedHomePage, "topAiringAnimes"> & {
        producerName: string;
    };
