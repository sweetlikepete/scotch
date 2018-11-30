

const SET_GLOBAL_DATA = "route/SET_GLOBAL_DATA";

const globalReducer = function(state = {}, action){

    switch(action.type){

        case SET_GLOBAL_DATA :{

            return action.data;

        }

        default :{

            return state;

        }

    }

};


export {
    globalReducer as default,
    SET_GLOBAL_DATA
};

