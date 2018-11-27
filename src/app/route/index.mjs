

import GraphqlClient from "../../graphql/client";
import { Helmet } from "react-helmet";
import React from "react";


export default class RouteComponent extends React.Component{

    static data(){

        return {};

    }

    shouldComponentUpdate(){

        if(this.props.data){

            return false;

        }

        return true;

    }

    content(){

        return (
            <div>Empty page</div>
        );

    }

    meta(){

        return (
            <Helmet>
                <title>Empty Title</title>
            </Helmet>
        );

    }

    loading(){

        return <h1>Loading...</h1>;

    }

    render(){

        console.log("render call");

        if(this.props.data){

            console.log("render call with data");

            return (
                <div>
                    { this.meta() }
                    { this.content() }
                </div>
            );

        }

        return this.loading();

    }

}
