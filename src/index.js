

import connectRoute from "./routes/connect";
import createClient from "./client";
import createStore from "./store";
import { Helmet } from "react-helmet";


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
    createServer,
    createStore,
    Helmet
};
