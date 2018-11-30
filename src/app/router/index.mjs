


import React from "react";

import { Switch } from "react-router-dom";


export default class Router extends React.Component{

    shouldComponentUpdate(){

        return false;

    }

    render(){

        return (
            <Switch>
                { this.props.routes.map((Route) => <Route req={ this.props.req } res={ this.props.res } />) }
            </Switch>
        );

    }

}
