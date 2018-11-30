

import {
    Route,
    Switch
} from "react-router-dom";

import React from "react";


export default class Router extends React.Component{

    shouldComponentUpdate(){

        return true;

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
                        render={ (p) => <Component { ...p } req={ this.props.req } res={ this.props.res } /> }
                    />
                )) }
            </Switch>
        );

    }

}
