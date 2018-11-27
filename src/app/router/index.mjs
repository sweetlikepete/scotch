

import {
    Route,
    Switch
} from "react-router-dom";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { frontloadConnect } from "react-frontload";
import loadable from "react-loadable";
import React from "react";
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

const createRouter = ({ component, loading, routes, webpack }) => {

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
            render(Component, props){
                return <Component { ...props } />;
            },
            webpack: () => webpack(route.id)
        }),
        exact: route.exact !== false,
        path: route.path
    }));

    // There is only one export in this file and it's a function that generates this component
    // eslint-disable-next-line react/no-multi-comp
    return function switchComponent(props){

        return (
            <Switch>
                { routeMappings.map((route) => {

                    const Component = route.component;

                    return (
                        <Route
                            exact={ route.exact }
                            key={ route.path }
                            path={ route.path }

                            /*
                             * We're going to let this one slide for now, because we need to override
                             * the render method and I can't think of how to do this without a function
                             */
                            // eslint-disable-next-line react/jsx-no-bind
                            render={ (prps) => <Component { ...prps } { ...props } /> }
                        />
                    );

                }) }
            </Switch>
        );

    };

};


export {
    createRouter as default
};
