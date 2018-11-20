

import app from "./app";
import manifest from "./manifest";
import stat from "./static";


const routes = {
    app,
    manifest,
    static: stat
};


export {
    routes as default
};
