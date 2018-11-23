

import {
    Frontload,
    frontloadServerRender
} from "react-frontload";

import compression from "compression";
import createStore from "../../store";
import express from "express";
import fs from "fs";
import { getBundles } from "react-loadable/webpack";
import { Helmet } from "react-helmet";
import Loadable from "react-loadable";
import path from "path";
import { Provider } from "react-redux";
import React from "react";
import { renderToString } from "react-dom/server";
import slash from "express-slash";
import { StaticRouter } from "react-router-dom";


const generateRouter = ({
    App,
    cwd = process.cwd(),
    local,
    reducers,
    staticFolder
}) => {

    // Force exact matches on paths
    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    router.use(slash());

    router.use(compression());

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
                            <App req={ req } res={ res } />
                        </Frontload>
                    </StaticRouter>
                </Provider>
            </Loadable.Capture>
        ));

        const helmet = Helmet.renderStatic();

        const assetMap = (ext) => [
            ...new Set(
                getBundles(stats, modules)
                .filter((bundle) => bundle.file.endsWith(`.${ ext }`))
                .map((bundle) => bundle.publicPath)
                .concat([
                    assets.main[ext]
                ])
            )
        ];

        const scripts = assetMap("js");
        const styles = assetMap("css");

        const encodedStaticFolder = staticFolder.split("/").map((sub) => encodeURIComponent(sub)).join("/");
        const link = (url, type) => `<${ url.replace(`/${ staticFolder }/`, `/${ encodedStaticFolder }/`) }>;rel=preload;as=${ type }`;

        // Set the http2 lint header with assets that need to be pushed
        res.setHeader("link", [
            ...scripts.map((url) => link(url, "script")),
            ...styles.map((url) => link(url, "style"))
        ].join(","));

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
                    ${ styles.map((href) => `<link href="${ href }" rel="stylesheet">`).join("") }
                </head>
                <body ${ helmet.bodyAttributes.toString() }>
                    <div id="app">${ html }</div>
                    ${ scripts.map((src) => `<script src="${ src }"></script>`).join("") }
                </body>
            </html>
        `
        .replace(/^\s*/gm, "")
        .replace(/(?:\r\n|\r|\n)/g, ""));

        res.end();

    });

    return router;

};


export {
    generateRouter as default
};
