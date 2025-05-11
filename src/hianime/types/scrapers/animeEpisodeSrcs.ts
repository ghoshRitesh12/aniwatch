import type { Intro, Subtitle, Video } from "../extractor.js";

export type ScrapedAnimeEpisodesSources = {
    headers?: {
        [k: string]: string;
    };
    intro?: Intro;
    subtitles?: Subtitle[];
    sources: Video[];
    download?: string;
    embedURL?: string;
};
