

import defaultMutations from "./mutations";
import defaultQueries from "./queries";
import merge from "merge";
import types from "./types";


const generateSchema = ({
    authorized = false,
    mutations,
    queries
}) => {

    const filter = (obj) => Object.keys(obj).reduce((acc, val) => {

        if(authorized || obj[val].public){
            acc[val] = obj[val];
        }

        return acc;

    }, {});

    const schema = new types.schema({
        mutation: new types.object({
            fields: filter(merge.recursive({}, !mutations ? defaultMutations : {}, mutations || {})),
            name: "Mutation"
        }),
        query: new types.object({
            fields: filter(merge.recursive({}, !queries ? defaultQueries : {}, queries || {})),
            name: "Query"
        })
    });

    return schema;

};


export {
    generateSchema as default
};
