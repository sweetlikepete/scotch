

import BaseGraphqlClient from "./base";
import gclient from "graphql-client";
import generateSchema from "../schema";
import gql from "graphql";


class GraphqlClient extends BaseGraphqlClient{

    async query(source, variables){

        let response = null;

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
                throw this.error(response.errors[0]);
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
                throw this.error(response.errors[0]);
            }

        }

        return response.data;

    }

}


export {
    GraphqlClient as default
};
