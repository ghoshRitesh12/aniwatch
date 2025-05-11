import type { AZ_LIST_SORT_OPTIONS } from "../../utils/constants.js";

export type Anime = {
    id: string | null;
    name: string | null;
    jname: string | null;
    poster: string | null;
    duration: string | null;
    type: string | null;
    rating: string | null;
    episodes: {
        sub: number | null;
        dub: number | null;
    };
};

type CommonAnimeProps = "id" | "name" | "poster";

export type Top10Anime = Pick<Anime, CommonAnimeProps | "episodes"> & {
    rank: number | null;
    jname: string | null;
};

export type Top10AnimeTimePeriod = "day" | "week" | "month";

export type MostPopularAnime = Pick<
    Anime,
    CommonAnimeProps | "episodes" | "type"
> & {
    jname: string | null;
};

export type SpotlightAnime = MostPopularAnime &
    Pick<Top10Anime, "rank"> & {
        description: string | null;
        otherInfo: string[];
    };

export type TrendingAnime = Pick<Anime, CommonAnimeProps | "jname"> &
    Pick<Top10Anime, "rank">;

export type LatestEpisodeAnime = Anime;

export type TopUpcomingAnime = Anime;

export type TopAiringAnime = MostPopularAnime;
export type MostFavoriteAnime = MostPopularAnime;
export type LatestCompletedAnime = MostPopularAnime;

export type AnimeGeneralAboutInfo = Pick<Anime, CommonAnimeProps> &
    Pick<SpotlightAnime, "description"> & {
        anilistId: number | null;
        malId: number | null;
        stats: {
            quality: string | null;
        } & Pick<Anime, "duration" | "episodes" | "rating" | "type">;
        promotionalVideos: AnimePromotionalVideo[];
        charactersVoiceActors: AnimeCharactersAndVoiceActors[];
    };

export type RecommendedAnime = Anime;

export type RelatedAnime = MostPopularAnime;

export type Season = Pick<Anime, CommonAnimeProps> & {
    isCurrent: boolean;
    title: string | null;
};

export type AnimePromotionalVideo = {
    title: string | undefined;
    source: string | undefined;
    thumbnail: string | undefined;
};

export type AnimeCharactersAndVoiceActors = {
    character: AnimeCharacter;
    voiceActor: AnimeCharacter;
};

export type AnimeCharacter = {
    id: string;
    poster: string;
    name: string;
    cast: string;
};

export type AnimeSearchSuggestion = Omit<
    MostPopularAnime,
    "episodes" | "type"
> & {
    moreInfo: string[];
};

export type AnimeEpisode = Pick<Season, "title"> & {
    episodeId: string | null;
    number: number;
    isFiller: boolean;
};

export type SubEpisode = {
    serverName: string;
    serverId: number | null;
};
export type DubEpisode = SubEpisode;
export type RawEpisode = SubEpisode;

type ObjectToSumType<Obj> = {
    [K in keyof Obj]: Obj[K] extends Readonly<Obj[K]> ? K : never;
}[keyof Obj];

export type AZListSortOptions = ObjectToSumType<typeof AZ_LIST_SORT_OPTIONS>;

export type AnimeCategories =
    | "most-favorite"
    | "most-popular"
    | "subbed-anime"
    | "dubbed-anime"
    | "recently-updated"
    | "recently-added"
    | "top-upcoming"
    | "top-airing"
    | "movie"
    | "special"
    | "ova"
    | "ona"
    | "tv"
    | "completed";

export type AnimeServers =
    | "hd-1"
    | "hd-2"
    | "megacloud"
    | "streamsb"
    | "streamtape";

export enum Servers {
    VidStreaming = "hd-1",
    MegaCloud = "megacloud",
    StreamSB = "streamsb",
    StreamTape = "streamtape",
    VidCloud = "hd-2",
    AsianLoad = "asianload",
    GogoCDN = "gogocdn",
    MixDrop = "mixdrop",
    UpCloud = "upcloud",
    VizCloud = "vizcloud",
    MyCloud = "mycloud",
    Filemoon = "filemoon",
}
