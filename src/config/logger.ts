import { pino, type LoggerOptions } from "pino";

function isDevEnv(): boolean {
    return (
        !process.env.NODE_ENV ||
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
    );
}

const loggerOptions: LoggerOptions = {
    level: "info",
    transport: isDevEnv()
        ? {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:standard",
              },
          }
        : undefined,
    formatters: {
        level(label) {
            return {
                level: label.toUpperCase(),
                context: "aniwatch-pkg",
            };
        },
    },
    redact: !isDevEnv() ? ["hostname"] : [],
    timestamp: pino.stdTimeFunctions.isoTime,
};

export const log = pino(loggerOptions);
