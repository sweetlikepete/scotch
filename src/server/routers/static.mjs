

import path from "path";
import express from "express";
import expressStaticGzip from "express-static-gzip";


const generateRouter = ({
    cacheExpiration = "1y",
    cwd = process.cwd(),
    staticFiles,
    staticFolder,
    xPoweredBy
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

        const single = item.src.indexOf(".") > 0;

        if(single){

            router.use(item.pub, express.static(path.join(cwd, item.src)));

        }else{

            router.use(item.pub, expressStaticGzip(path.join(cwd, item.src), {
                enableBrotli: true,
                etag: true,
                fallthrough: false,
                index: false,
                maxAge: cacheExpiration,
                orderPreference: ["br"],
                redirect: false,
                setHeaders: (res) => {

                    res.set("X-Content-Type-Options", "nosniff");
                    res.set("X-Powered-By", xPoweredBy);

                }
            }));

        }

    });

    return router;

};


export {
    generateRouter as default
};
