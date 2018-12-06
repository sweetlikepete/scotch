

const SET_LOADED = "loaded/SET_LOADED";

const loadedReducer = function(state = {}, action){

    switch(action.type){

        case SET_LOADED :{

            return action.url;

        }

        default :{

            return state;

        }

    }

};

const setLoaded = (url) => (dispatch) => {

    dispatch({
        type: SET_LOADED,
        url
    });

};


export {
    loadedReducer as default,
    setLoaded,
    SET_LOADED
};
