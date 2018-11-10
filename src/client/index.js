

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ConnectedRouter } from "connected-react-router";
import { createStore } from "..";
import { Frontload } from "react-frontload";
import { Provider } from "react-redux";


export default async function createClient(App, Loadable){

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

    await Loadable.preloadReady();

    ReactDOM.hydrate(application, document.getElementById("app"));

}
