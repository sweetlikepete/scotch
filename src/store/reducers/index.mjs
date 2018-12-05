

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import loaded from "./loaded";


const reducer = ({
    history,
    reducers = {}
}) => combineReducers({
    ...reducers,
    loaded,
    router: connectRouter(history)
});


export {
    reducer as default
};
