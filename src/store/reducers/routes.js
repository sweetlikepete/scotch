

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

const setRouteData = (data, url) => (dispatch) => {

    dispatch({
        data,
        type: SET_ROUTE_DATA,
        url
    });

};


export {
    routeReducer as default,
    setRouteData,
    SET_ROUTE_DATA
};

