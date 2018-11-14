

import express from "express";


const generateRouter = ({
    manifest
}) => {

    // Force exact matches on paths
    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    router.get("/manifest.json", (req, res) => {

        res.setHeader("Content-Type", "application/json");

        res
        .send(JSON.stringify(manifest))
        .end();


    });

    return router;

};


export {
    generateRouter as default
};
