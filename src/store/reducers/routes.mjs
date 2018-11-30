

const SET_ROUTE_DATA = "route/SET_ROUTE_DATA";

const routeReducer = function(state = {}, action){

    switch(action.type){

        case SET_ROUTE_DATA :{

            return {
                ...state,
                [action.url]: action.data
            };

        }

        default :{

            return state;

        }

    }

};


export {
    routeReducer as default,
    SET_ROUTE_DATA
};

