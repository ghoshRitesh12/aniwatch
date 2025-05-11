import { pino, type LoggerOptions } from "pino";

function isDevEnv(): boolean {
    return (
        !process.env.NODE_ENV ||
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
    );
}

const loggerOptions: LoggerOptions = {
    redact: !isDevEnv() ? ["hostname"] : [],
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
            };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger = pino(loggerOptions);
