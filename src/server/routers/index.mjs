

import app from "./app";
import graphql from "./graphql";
import manifest from "./manifest";
import stat from "./static";


const routes = {
    app,
    graphql,
    manifest,
    static: stat
};


export {
    routes as default
};
