import { AxiosError } from "axios";

const ANSI_ESCAPE_CODE_RED_COLOR = "\x1b[31m%s\x1b[0m";
const DEFAULT_ERROR_MESSAGE = "Something went wrong";

export class AniwatchError extends Error {
  public scraper: string;

  constructor(errMsg: string, scraperName: string) {
    super(`${scraperName}: ${errMsg}`);

    this.name = AniwatchError.name;
    this.scraper = scraperName;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AniwatchError);
    }

    this.logError();
  }

  static wrapError(err: AniwatchError | any, scraperName: string) {
    if (err instanceof AniwatchError) {
      return err;
    }

    if (err instanceof AxiosError) {
      const statusText = err?.response?.statusText || DEFAULT_ERROR_MESSAGE;
      return new AniwatchError("fetch_error: " + statusText, scraperName);
    }

    return new AniwatchError(
      err?.message || DEFAULT_ERROR_MESSAGE,
      scraperName
    );
  }

  private logError() {
    console.error(
      ANSI_ESCAPE_CODE_RED_COLOR,
      JSON.stringify(
        {
          scraper: this.scraper,
          message: this?.message || DEFAULT_ERROR_MESSAGE,
        },
        null,
        2
      )
    );
  }
}
