export type Video = {
    url: string;
    quality?: string;
    isM3U8?: boolean;
    size?: number;
    [x: string]: unknown;
};

export type Subtitle = {
    id?: string;
    url: string;
    lang: string;
};

export type Intro = {
    start: number;
    end: number;
};
