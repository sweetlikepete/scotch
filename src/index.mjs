

import createClient from "./client";
import createStore from "./store";
import GraphqlClient from "./graphql/client";
import graphQLTypes from "./graphql/types";
import logger from "./logger";
import Page from "./app/page";
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


export {
    createClient,
    createServer,
    createStore,
    GraphqlClient,
    graphQLTypes,
    logger,
    Page,
    Route,
    Router
};
