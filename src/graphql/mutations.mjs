

import types from "./types";


export default {

    TestMutation: {

        description: "The test mutation",

        public: true,

        resolve(){

            return {
                value: "test mutation"
            };

        },

        type: new types.object({
            fields: {
                value: {
                    type: types.string
                }
            },
            name: "TestMutation"
        })

    }

};
