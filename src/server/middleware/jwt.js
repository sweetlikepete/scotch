

import expressJWT from "express-jwt";
import logger from "../../logger";


const jwtMiddleware = ({
    jwtSecret,
    jwtCookieName
}) => {

    if(!jwtSecret){

        return (req, res, next) => {

            logger.warn("jwtMiddleware has not been configured. Missing jwtSecret.");

            next();

        };

    }

    return expressJWT({
        credentialsRequired: false,
        getToken: (req) => {

            if(
                req.cookies &&
                req.cookies[jwtCookieName]
            ){

                return req.cookies[jwtCookieName];

            }else if(
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ){

                return req.headers.authorization.split(" ")[1];

            }else if(
                req.query &&
                req.query.token
            ){

                return req.query.token;

            }

            return null;

        },
        secret: jwtSecret
    });

};


export {
    jwtMiddleware as default
};
