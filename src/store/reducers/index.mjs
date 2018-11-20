

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import routes from "./routes";


const reducer = ({
    history,
    reducers = {}
}) => combineReducers({
    ...reducers,
    router: connectRouter(history),
    routes
});


export {
    reducer as default
};
