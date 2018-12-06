

import express from "express";
import path from "path";


const generateRouter = ({
    cacheExpiration = "1y",
    cwd = process.cwd(),
    staticFiles,
    staticFolder
}) => {

    // Static public url base and source
    const src = "src/web/build/client";
    const encodedStaticFolder = staticFolder.split("/").map((sub) => encodeURIComponent(sub)).join("/");

    // Map of static paths to directories
    const map = [
        {
            pub: `/${ encodedStaticFolder }`,
            src
        }
    ].concat((staticFiles || []).map((file) => {

        file.src = file.src.replace(`/${ staticFolder }`, src);

        return file;

    }));

    // Force exact matches on paths
    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    map.forEach((item) => {

        router.use(item.pub, express.static(path.join(cwd, item.src), {
            etag: true,
            maxAge: cacheExpiration
        }));

    });

    return router;

};


export {
    generateRouter as default
};
