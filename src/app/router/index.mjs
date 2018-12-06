

import {
    Route,
    Switch
} from "react-router-dom";

import React from "react";


export default class Router extends React.Component{

    shouldComponentUpdate(){

        return true;

    }

    componentDidMount(){

        this.preloadRoutes();

    }

    preloadRoutes(){

        const initialDelay = 1000;
        const preloadDelay = 500;

        setTimeout(() => {

            const routes = [...this.props.routes];

            const preload = async () => {

                await routes.pop().page.preload();

                await setTimeout(preload, preloadDelay);

            };

            preload();

        }, initialDelay);

    }

    render(){

        return (
            <Switch>
                { this.props.routes.map((Component) => (
                    <Route
                        exact={ Component.exact }
                        key={ Component.path }
                        path={ Component.path }

                        /*
                         * We're going to let this one slide for now, because we need to override
                         * the render method and I can't think of how to do this without a function
                         */
                        // eslint-disable-next-line react/jsx-no-bind
                        render={ (props) => <Component { ...props } req={ this.props.req } res={ this.props.res } /> }
                        sensitive={ Component.sensitive }
                        strict={ Component.strict }
                    />
                )) }
            </Switch>
        );

    }

}
