

import createClient from "./client";
import createRouter from "./app/router";
import createStore from "./store";
import GraphqlClient from "./graphql/client";
import graphQLTypes from "./graphql/types";
import logger from "./logger";
import path from "path";
import Route from "./app/route";
import Router from "./app/router";


const isServer = !(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);

// Needed so that webpack won't require this on the server
// eslint-disable-next-line no-eval
const createServer = isServer ? eval("require")("./server").default : null;

const alias = (src) => path.resolve(process.cwd(), path.join("node_modules", src));

const aliases = {
    // Use the es version only
    history: alias("history/es"),
    // Different versions of the same package were being referenced
    "hoist-non-react-statics": alias("hoist-non-react-statics"),
    // Use preact instead of react to save some weight
    react: alias("preact-compat/dist/preact-compat.es.js"),
    // Use preact instead of react to save some weight
    "react-dom": alias("preact-compat/dist/preact-compat.es.js"),
    // Use the es version only
    "react-redux": alias("react-redux/es"),
    // Use the es version only
    "react-router-dom": alias("react-router-dom/es"),
    // Use the es version only
    redux: alias("redux/es/redux.js"),
    // Different versions of the same package were being referenced
    warning: alias("warning")
};


export {
    aliases,
    createClient,
    createRouter,
    createServer,
    createStore,
    GraphqlClient,
    graphQLTypes,
    logger,
    Route,
    Router
};
