

import express from "express";
import expressStaticGzip from "express-static-gzip";
import path from "path";


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
                setHeaders: (res, resPath) => {

                    let encoding = null;

                    encoding = resPath.endsWith(".br") ? "br" : encoding;
                    encoding = resPath.endsWith(".gz") ? "gzip" : encoding;

                    if(encoding){
                        res.set("X-Content-Encoding-Test", `wtf: ${ encoding }`);
                        res.set("Content-Encoding", encoding);
                    }

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
