

import domain from "./domain";
import header from "./header";
import jwt from "./jwt";
import logger from "./logger";


const middleware = {
    domain,
    header,
    jwt,
    logger
};


export {
    middleware as default
};
