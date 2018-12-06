

import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import loadable from "react-loadable";
import logger from "../logger";
import middleware from "./middleware";
import routers from "./routers";


const createServer = function({
    App,
    cacheExpiration = "1y",
    csp,
    cwd = process.cwd(),
    graphQLAuthorized,
    graphQLEndpoint = "/graphql/",
    graphQLHost,
    graphQLMutations,
    graphQLQueries,
    hostname,
    jwtSecret,
    // This isn't a magic number, it's the max age of the jwt cookie - we'll use it later
    // eslint-disable-next-line no-magic-numbers, no-unused-vars
    jwtCookieMaxAge = 31557600000,
    jwtCookieName = "jwtcookie",
    local = false,
    manifest,
    // This isn't a magic number, it's the port
    // eslint-disable-next-line no-magic-numbers, no-process-env
    port = process.env.PORT || 20000,
    reducers = {},
    staticFiles = [],
    staticFolder = "🥃",
    xPoweredBy = "https://www.youtube.com/watch?v=e_DqV1xdf-Y"
}){

    // Create the express application
    const app = express();

    // Ensures the correct ip through express request.ip
    app.enable("trust proxy");

    // Condition the domain by always redirecting to the configured domain
    app.use(middleware.domain({
        hostname,
        local
    }));

    // Disable cache on the local development server
    if(local){
        app.disable("etag");
    }

    // Use gzip through the compression middleware for all non-static routes
    app.use(compression({
        threshold: 0
    }));

    // Add the static file router
    app.use(routers.static({
        cacheExpiration,
        cwd,
        staticFiles,
        staticFolder
    }));

    // Add the /manifest.json router if the manifest was configured
    if(manifest){
        app.use(routers.manifest(manifest));
    }

    // Enable some default protections with https://www.npmjs.com/package/helmet
    app.use(helmet());

    // Add the header middleware
    app.use(middleware.header({ xPoweredBy }));

    // Set up content security policy if it's configured
    if(csp){
        app.use(helmet.contentSecurityPolicy(csp));
    }

    // Set up HSTS, max age 60 days in seconds
    app.use(helmet.hsts({ maxAge: 5184000 }));

    // Add the cookie parsing middleware
    app.use(cookieParser());

    // Add the JWT middleware. This requires the cookieParser middleware.
    app.use(middleware.jwt({
        jwtCookieName,
        jwtSecret
    }));

    // Add the request logger here so it skips static file requests.
    app.use(middleware.logger());

    // Add the graphql router
    app.use(routers.graphql({
        authorized: graphQLAuthorized,
        endpoint: graphQLEndpoint,
        host: graphQLHost,
        mutations: graphQLMutations,
        queries: graphQLQueries
    }));

    // Add app router
    app.use(routers.app({
        App,
        cwd,
        local,
        reducers,
        staticFolder
    }));

    /*
     * Listen for unhandled promise rejections and log the errors. If this isn't
     * done, it's pretty impossible to track these errors down.
     */
    process.on("unhandledRejection", (reason, promise) => {

        logger.error(`Unhandled Rejection at: ${ promise }\nreason:\n${ reason }\n`);

        if(local){
            console.error(reason);
        }

    });

    /*
     * Listen for unhandled promise rejections and log the errors. If this isn't
     * done, it's pretty impossible to track these errors down.
     */
    process.on("uncaughtException", (exception) => {

        logger.error(`Caught exception: ${ exception }\n`);

    });

    // Start up the server after the preloads complete
    loadable.preloadAll().then(() => {

        app.listen(port, () => {

            logger.log(`App listening on port ${ port }`);
            logger.log("Press Ctrl+C to quit.");

        });

    }).catch((err) => {

        logger.error("loadable.preloadAll() failed.");
        logger.error(err);

    });

    return app;

};


export default createServer;
