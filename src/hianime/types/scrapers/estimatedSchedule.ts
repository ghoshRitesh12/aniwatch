type EstimatedSchedule = {
    id: string | null;
    time: string | null;
    name: string | null;
    jname: string | null;
    airingTimestamp: number;
    secondsUntilAiring: number;
    episode: number;
};

export type ScrapedEstimatedSchedule = {
    scheduledAnimes: EstimatedSchedule[];
};

export type ScrapedNextEpisodeSchedule = {
    airingISOTimestamp: string | null;
    airingTimestamp: number | null;
    secondsUntilAiring: number | null;
};
