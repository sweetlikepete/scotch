

import gclient from "graphql-client";
import generateSchema from "./schema";
import gql from "graphql";


const gqlError = (err) => {

    const error = new Error();

    error.name = "GraphQL Error";
    error.message = err.message;

    return error;

};


class GraphqlClient{

    constructor({
        authorized = (req) => !req,
        endpoint = "/graphql/",
        host,
        mutations,
        queries,
        req,
        res
    }){

        this.authorized = authorized;
        this.endpoint = endpoint;
        this.host = host;
        this.mutations = mutations;
        this.queries = queries;
        this.req = req;
        this.res = res;

    }

    async query(source, variables){

        let response = null;

        // Webpack rewrites this reference to process through the DefinePlugin
        // eslint-disable-next-line no-process-env
        if(process.env.ENVIRONMENT !== "client"){

            /*
             * Point the client to a specific host. You shouldn't do this unless
             * you've had a good hard think about the consequences.
             */
            if(this.host){

                const client = await gclient({
                    credentials: "same-origin",
                    url: `https://${ this.host }${ this.endpoint }`
                });

                response = await client.query(source, variables);

                if(response.errors){
                    throw gqlError(response.errors[0]);
                }

            }else{

                response = await gql.graphql({
                    contextValue: {
                        req: this.req,
                        res: this.res
                    },
                    schema: generateSchema({
                        authorized: this.authorized(this.req),
                        mutations: this.mutations,
                        queries: this.queries
                    }),
                    source,
                    variableValues: variables
                });

                if(response.errors){
                    throw gqlError(response.errors[0]);
                }

            }

        }else{

            const protocol = window.location.protocol.replace(/:/g, "");
            const host = window.location.hostname;
            const port = window.location.port;

            const client = await gclient({
                credentials: "same-origin",
                url: `${ protocol }://${ host }:${ port }${ this.endpoint }`
            });

            response = await client.query(source, variables);

            if(response.errors){
                throw gqlError(response.errors[0]);
            }

        }

        return response.data;

    }

}


export {
    GraphqlClient as default
};
