

import * as path from "path";
import express from "express";
import expressStaticGzip from "express-static-gzip";


const generateRouter = ({
    cacheExpiration = "1y",
    cwd = process.cwd(),
    local,
    production,
    staticFolder,
    xPoweredBy
}) => {

    // Static public url base and source
    const pub = staticFolder;
    const src = "src/web/build/client";

    // Map of static paths to directories
    const map = [
        {
            pub: `/${ encodeURIComponent(pub) }`,
            src
        },
        {
            pub: "/favicon.ico",
            src: "src/web/app/icons/favicon/favicon.ico"
        },
        {
            pub: "/robots.txt",
            src: "src/web/app/robots.txt"
        }
    ];

    // Force exact matches on paths
    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    // Express static options https://expressjs.com/en/api.html#express.static
    const options = {
        enableBrotli: !local,
        etag: production,
        fallthrough: false,
        index: false,
        maxAge: production ? cacheExpiration : 0,
        redirect: false,
        setHeaders: (res) => {

            res.set("X-Content-Type-Options", "nosniff");
            res.set("X-Powered-By", xPoweredBy);

        }
    };

    map.forEach((item) => {

        // Use gzip in production for folders
        const handler = !production || item.src.indexOf(".") > 0 ? express.static : expressStaticGzip;

        router.use(item.pub, handler(path.join(cwd, item.src), options));

    });

    return router;

};


export {
    generateRouter as default
};
