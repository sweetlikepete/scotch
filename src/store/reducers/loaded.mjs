

const SET_LOADED = "loaded/SET_LOADED";

const loadedReducer = function(state = {}, action){

    switch(action.type){

        case SET_LOADED :{

            return {
                ...state,
                [action.url]: action.loaded || true
            };

        }

        default :{

            return state;

        }

    }

};

const setLoaded = (url) => (dispatch) => {

    dispatch({
        loaded: true,
        type: SET_LOADED,
        url
    });

};


export {
    loadedReducer as default,
    setLoaded,
    SET_LOADED
};
