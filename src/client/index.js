

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ConnectedRouter } from "connected-react-router";
import { createStore } from "..";
import { Frontload } from "react-frontload";
import loadable from "react-loadable";
import { Provider } from "react-redux";


export default async function createClient(App){

    const { store, history } = createStore({});

    const application = (
        <Provider store={ store }>
            <ConnectedRouter history={ history }>
                <Frontload noServerRender>
                    <App />
                </Frontload>
            </ConnectedRouter>
        </Provider>
    );

    await loadable.preloadReady();

    ReactDOM.hydrate(application, document.getElementById("app"));

}
