

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import global from "./global";
import routes from "./routes";


const reducer = ({
    history,
    reducers = {}
}) => combineReducers({
    ...reducers,
    router: connectRouter(history),
    global,
    routes
});


export {
    reducer as default
};
