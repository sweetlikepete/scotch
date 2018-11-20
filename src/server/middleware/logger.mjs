

import logger from "../../logger";


const loggingMiddleware = () => (req, res, next) => {

    logger.log(`${ req.url } endpoint hit`, {
        httpRequest: {
            remoteIp: req.connection.remoteAddress,
            requestMethod: req.method,
            requestUrl: req.url,
            status: res.statusCode
        }
    });

    next();

};


export {
    loggingMiddleware as default
};
