

import expressWinston from "express-winston";
import winston from "winston";


const logger = ({ local }) => ({

    error: expressWinston.errorLogger({
        transports: [
            new winston.transports.Console({
                colorize: local,
                json: true
            })
        ]
    }),

    request: expressWinston.logger({
        expressFormat: true,
        meta: false,
        transports: [
            new winston.transports.Console({
                colorize: local,
                json: false
            })
        ]
    })

});


export {
    logger as default
};
