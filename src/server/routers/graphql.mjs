

import bodyParser from "body-parser";
import express from "express";
import generateSchema from "../../graphql/schema";
import graphqlHTTP from "express-graphql";
import https from "https";


const postJSON = (options, data) => new Promise((resolve, reject) => {

    const req = https.request(options, (res) => {

        const output = [];

        res.setEncoding("utf8");

        res.on("data", (chunk) => {
            output.push(chunk);
        });

        res.on("end", () => {

            resolve({
                data: JSON.parse(output.join("")),
                status: res.statusCode
            });

        });

    });

    req.on("error", reject);
    req.write(JSON.stringify(data));
    req.end();

});

const generateRouter = ({
    authorized = (req) => !req,
    endpoint = "/graphql/",
    host,
    mutations,
    queries
}) => {

    const router = express.Router({
        caseSensitive: true,
        strict: true
    });

    const gqlServer = (req, res, graphiql = false) => {

        res.setHeader("Content-Security-Policy", "");

        return {
            context: {
                req,
                res
            },
            graphiql,
            schema: generateSchema({
                authorized: authorized(req),
                mutations,
                queries
            })
        };

    };

    router.get(
        endpoint,
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        (req, res) => graphqlHTTP(() => gqlServer(req, res, true))(req, res)
    );

    if(host){

        router.post(
            endpoint,
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true }),
            async (req, res) => {

                res.setHeader("Content-Security-Policy", "");

                const headers = req.headers;

                delete headers.origin;
                delete headers.host;
                delete headers["content-length"];

                const { data, status } = await postJSON({
                    headers,
                    hostname: host,
                    method: "POST",
                    path: endpoint,
                    port: 443
                }, req.body);

                res.status(status).send(JSON.stringify(data)).end();

            }
        );

    }else{

        router.post(endpoint, (req, res) => graphqlHTTP(() => gqlServer(req, res))(req, res));

    }

    return router;

};


export {
    generateRouter as default
};
