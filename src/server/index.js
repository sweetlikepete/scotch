

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
    hostname,
    local = false,
    manifest,
    // This isn't a magic number, it's the port
    // eslint-disable-next-line no-magic-numbers, no-process-env
    port = process.env.PORT || 20000,
    production = true,
    reducers = {},
    staticFolder = "static",
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

    // Use gzip through the compression middleware
    app.use(compression());

    // Add the static file router
    app.use(routers.static({
        cacheExpiration,
        cwd,
        local,
        production,
        staticFolder,
        xPoweredBy
    }));

    // Add the /manifest.json router if the manifest was configured
    if(manifest){
        app.use(routers.manifest(manifest));
    }

    // Enable some default protections with https://www.npmjs.com/package/helmet
    app.use(helmet());

    // Set up content security policy if it's configured
    if(csp){
        app.use(helmet.contentSecurityPolicy(csp));
    }

    // Set up HSTS, max age 60 days in seconds
    app.use(helmet.hsts({ maxAge: 5184000 }));

    // Add the cookie parsing middleware
    app.use(cookieParser());

    // Add the request logger here so it skips static file requests.
    app.use(middleware.logger());

    // Add app router
    app.use(routers.app({
        App,
        cwd,
        local,
        reducers
    }));

    /*
     * Listen for unhandled promise rejections and log the errors. If this isn't
     * done, it's pretty impossible to track these errors down.
     */
    process.on("unhandledRejection", (reason, rejection) => {

        logger.error(`Unhandled Rejection at: ${ rejection }\nreason:\n${ reason }\n`);

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

            console.log(`App listening on port ${ port }`);
            console.log("Press Ctrl+C to quit.");

        });

    }).catch((err) => {

        console.error("loadable.preloadAll() failed.");
        console.error(err);

    });

    return app;

};


export default createServer;
