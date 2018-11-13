

import connectRoute from "./routes/connect";
import createClient from "./client";
import createRoutes from "./routes";
import createStore from "./store";


const isServer = !(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);

// Needed so that webpack won't require this on the server
// eslint-disable-next-line no-eval
const createServer = isServer ? eval("require")("./server").default : null;


export {
    connectRoute,
    createClient,
    createRoutes,
    createServer,
    createStore
};
