

class BaseGraphqlClient{

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

    error(err){

        const error = new Error();

        error.name = "GraphQL Error";
        error.message = err.message;

        return error;

    }

}


export {
    BaseGraphqlClient as default
};
