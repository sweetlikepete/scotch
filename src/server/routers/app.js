

import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import { Frontload, frontloadServerRender } from "react-frontload";
import createStore from "../../store";
import express from "express";
import { getBundles } from "react-loadable/webpack";
import { Helmet } from "react-helmet";
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import { renderToString } from "react-dom/server";
import slash from "express-slash";
import { StaticRouter } from "react-router-dom";


const generateRouter = ({
    App,
    cwd = process.cwd(),
    local,
    reducers
}) => {

    // Force exact matches on paths
    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    router.use(slash());

    /*
     * Force 301 redirects when there is no trailing slash
     * router.use(slash);
     */

    let stats = null;
    let assets = null;

    router.get("*/", async (req, res) => {

        const { store } = createStore({
            reducers,
            url: req.url
        });

        if(local || !stats || !assets){

            // It's ok because it only happens once per restart
            // eslint-disable-next-line no-sync
            stats = JSON.parse(fs.readFileSync(path.join(cwd, "src/web/build/client/react-loadable-stats.json")));
            // It's ok because it only happens once per restart
            // eslint-disable-next-line no-sync
            assets = JSON.parse(fs.readFileSync(path.join(cwd, "src/web/build/client/webpack-assets.json")));

        }

        const modules = [];
        const context = {};

        const html = await frontloadServerRender(() => renderToString(
            // eslint-disable-next-line react/jsx-no-bind
            <Loadable.Capture report={ (name) => modules.push(name) }>
                <Provider store={ store }>
                    <StaticRouter context={ context } location={ req.originalUrl }>
                        <Frontload isServer>
                            <App />
                        </Frontload>
                    </StaticRouter>
                </Provider>
            </Loadable.Capture>
        ));

        const helmet = Helmet.renderStatic();

        const scripts = [...new Set(getBundles(stats, modules).filter((bundle) => bundle.file.endsWith(".js"))
        .map((bundle) => bundle.publicPath)
        .concat([
            assets.main.js
        ]))];

        res.send(`
            <!doctype html>
                <html ${ helmet.htmlAttributes.toString() }>
                <head>
                    ${ helmet.title.toString() }
                    <base href="/">
                    <meta name="generator" content="Idle Hands">
                    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1,user-scalable=0,viewport-fit=cover">
                    ${ helmet.meta.toString() }
                    ${ helmet.link.toString() }
                    <script id="app-state-data" type="application/json">${ JSON.stringify(store.getState()) }</script>
                </head>
                <body ${ helmet.bodyAttributes.toString() }>
                    <div id="app">${ html }</div>
                    ${ scripts.map((src) => `<script src="${ src }"></script>`).join("") }
                </body>
            </html>
        `
        .replace(/^\s*/gm, "")
        .replace(/(?:\r\n|\r|\n)/g, ""));

    });

    return router;

};


export {
    generateRouter as default
};
