import { AxiosError } from "axios";
import type { AniwatchError } from "../config/error.js";

const ANSI_RED_COLOR = "\x1b[31m";
const ANSI_RESET_COLOR = "\x1b[0m";

const DEFAULT_ERROR_STATUS = 500;
const DEFAULT_ERROR_MESSAGE = "Something went wrong";

export class HiAnimeError extends Error implements AniwatchError {
  public scraper: string = DEFAULT_ERROR_MESSAGE;
  public status: number = DEFAULT_ERROR_STATUS;

  constructor(errMsg: string, scraperName: string, status?: number) {
    super(`${scraperName}: ${errMsg}`);

    this.name = HiAnimeError.name;
    this.scraper = scraperName;

    if (status) {
      this.status =
        status >= 400 && status < 600 ? status : DEFAULT_ERROR_STATUS; // default status
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HiAnimeError);
    }

    this.logError();
  }

  static wrapError(err: HiAnimeError | any, scraperName: string): HiAnimeError {
    if (err instanceof HiAnimeError) {
      return err;
    }

    if (err instanceof AxiosError) {
      const statusText = err?.response?.statusText || DEFAULT_ERROR_MESSAGE;
      return new HiAnimeError(
        "fetchError: " + statusText,
        scraperName,
        err.status || DEFAULT_ERROR_STATUS
      );
    }

    return new HiAnimeError(err?.message || DEFAULT_ERROR_MESSAGE, scraperName);
  }

  public json(): { status: number; message: string } {
    return {
      status: this.status,
      message: this.message,
    };
  }

  private logError() {
    console.error(
      ANSI_RED_COLOR +
        JSON.stringify(
          {
            status: this.status,
            scraper: this.scraper,
            message: this.message,
          },
          null,
          2
        ) +
        ANSI_RESET_COLOR
    );
  }
}
