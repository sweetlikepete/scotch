

import createClient from "./client";
import createRoutes from "./routes";
import createStore from "./store";
import logger from "./logger";
import RouteComponent from "./route";


const isServer = !(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);

// Needed so that webpack won't require this on the server
// eslint-disable-next-line no-eval
const createServer = isServer ? eval("require")("./server").default : null;


export {
    createClient,
    createRoutes,
    createServer,
    createStore,
    logger,
    RouteComponent
};
