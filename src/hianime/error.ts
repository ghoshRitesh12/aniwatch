import { AxiosError } from "axios";
import type { AniwatchError } from "../config/error.js";
import { log } from "../config/logger.js";

const ANSI_ESC_CODE_COLOR_RED = "\x1b[31m";
const ANSI_ESC_CODE_COLOR_RESET = "\x1b[0m";

export class HiAnimeError extends Error implements AniwatchError {
    static DEFAULT_ERROR_STATUS = 500;
    static DEFAULT_ERROR_MESSAGE = "Something went wrong";

    public scraper: string = HiAnimeError.DEFAULT_ERROR_MESSAGE;
    public status: number = HiAnimeError.DEFAULT_ERROR_STATUS;

    constructor(errMsg: string, scraperName: string, status?: number) {
        super(`${scraperName}: ${errMsg}`);

        this.name = HiAnimeError.name;
        this.scraper = scraperName;

        if (status) {
            this.status =
                status >= 400 && status < 600
                    ? status
                    : HiAnimeError.DEFAULT_ERROR_STATUS; // default status
        }

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HiAnimeError);
        }

        this.logError();
    }

    static wrapError(
        err: HiAnimeError | any,
        scraperName: string
    ): HiAnimeError {
        if (err instanceof HiAnimeError) {
            return err;
        }

        if (err instanceof AxiosError) {
            const statusText =
                err?.response?.statusText || HiAnimeError.DEFAULT_ERROR_MESSAGE;
            return new HiAnimeError(
                "fetchError: " + statusText,
                scraperName,
                err.status || HiAnimeError.DEFAULT_ERROR_STATUS
            );
        }

        return new HiAnimeError(
            err?.message || HiAnimeError.DEFAULT_ERROR_MESSAGE,
            scraperName
        );
    }

    public json(): { status: number; message: string } {
        return {
            status: this.status,
            message: this.message,
        };
    }

    private logError() {
        log.error(
            ANSI_ESC_CODE_COLOR_RED +
                JSON.stringify(
                    {
                        status: this.status,
                        scraper: this.scraper,
                        message: this.message,
                    },
                    null,
                    2
                ) +
                ANSI_ESC_CODE_COLOR_RESET
        );
    }
}
