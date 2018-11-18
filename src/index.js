

import createAppRoutes from "./app/routes";
import createClient from "./client";
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
    createAppRoutes,
    createClient,
    createServer,
    createStore,
    logger,
    RouteComponent
};
