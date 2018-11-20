

import { applyMiddleware, compose, createStore } from "redux";
import { createBrowserHistory, createMemoryHistory } from "history";
import createRootReducer from "./reducers";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";


// A nice helper to tell us if we're on the server
export const isServer = !(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);


export default function createStoreProxy({
    reducers,
    url = "/"
}){

    // Create a history depending on the environment
    const history = isServer ? createMemoryHistory({ initialEntries: [url] }) : createBrowserHistory();
    const enhancers = [];
    const middleware = [thunk, routerMiddleware(history)];
    const stateDataId = "app-state-data";

    // Do we have preloaded state available? Great, save it.
    const initialState = !isServer ? JSON.parse(document.getElementById(stateDataId).innerHTML) : {};

    // Delete it once we have it stored in a variable
    if(!isServer){
        document.getElementById(stateDataId).parentNode.removeChild(document.getElementById(stateDataId));
    }

    // Create the store
    const store = createStore(
        createRootReducer({
            history,
            reducers
        }),
        initialState,
        compose(
            applyMiddleware(...middleware),
            ...enhancers
        )
    );

    return {
        history,
        store
    };

}
