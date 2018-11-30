

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import global from "./global";
import routes from "./routes";


const reducer = ({
    history,
    reducers = {}
}) => combineReducers({
    ...reducers,
    global,
    router: connectRouter(history),
    routes
});


export {
    reducer as default
};
