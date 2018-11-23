

import types from "./types";


export default {

    test: {

        description: "The test query",

        public: true,

        resolve(){

            return {
                value: "test query"
            };

        },

        type: new types.object({
            fields: {
                value: {
                    type: types.string
                }
            },
            name: "TestQuery"
        })

    }

};
