
import { LoggingWinston } from "@google-cloud/logging-winston";
import winston from "winston";


// Reading these from the environment is better thaan the alternative
/* eslint-disable no-process-env */
const service = process.env.GAE_SERVICE;
const version = process.env.GAE_VERSION;
/* eslint-enable no-process-env */

const loggingWinston = service && version ? new LoggingWinston({
    serviceContext: {
        service,
        version
    }
}) : null;

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console()
    ].concat(loggingWinston ? [loggingWinston] : [])
});

export default {
    debug: logger.debug,
    error: logger.error,
    info: logger.info,
    log: (...args) => {
        logger.info.apply(null, args);
    },
    silly: logger.silly,
    verbose: logger.verbose,
    warn: logger.warn
};
