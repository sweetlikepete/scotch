

import React from "react";

import {
    Route,
    Switch
} from "react-router-dom";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { frontloadConnect } from "react-frontload";
import loadable from "react-loadable";
import { setRouteData } from "../../store/reducers/routes";


const connectRoute = (mod) => {

    const connectedMod = connect(
        (state, props) => ({ data: state.routes[props.match.url] }),
        (dispatch) => bindActionCreators({ setRouteData }, dispatch)
    )(
        frontloadConnect(async (props) => {

            if(!props.data){

                const data = await mod.default.data();

                props.setRouteData(data, props.match.url);

            }

        }, {
            onMount: true,
            onUpdate: false
        })(mod.default)
    );

    return connectedMod;

};

const createAppRoutes = ({ component, loading, routes, webpack }) => {

    const routeMappings = routes.map((route) => ({
        component: loadable({
            loader: () => new Promise((resolve) => {

                (route.component || component)(route.id).then((mod) => {

                    resolve(connectRoute(mod));

                }).catch((err) => {

                    console.log(err);

                });

            }),
            loading: route.loading || loading,
            modules: [`./${ route.id }/`],
            webpack: () => webpack(route.id)
        }),
        exact: route.exact !== false,
        path: route.path
    }));

    return (props) => {

        return (
            <Switch>
                { routeMappings.map((route) => <Route { ...route } key={ route.path } req={ props.req } />) }
            </Switch>
        );

    };

};


export {
    createAppRoutes as default
};
