

import BaseGraphqlClient from "./base";
import gclient from "graphql-client";


class GraphqlClient extends BaseGraphqlClient{

    async query(source, variables){

        const protocol = window.location.protocol.replace(/:/g, "");
        const host = window.location.hostname;
        const port = window.location.port;

        const client = await gclient({
            credentials: "same-origin",
            url: `${ protocol }://${ host }:${ port }${ this.endpoint }`
        });

        const response = await client.query(source, variables);

        if(response.errors){
            throw this.error(response.errors[0]);
        }

        return response.data;

    }

}


export {
    GraphqlClient as default
};
