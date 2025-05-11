export interface AniwatchError extends Error {
    scraper: string;
    status: number;
}
