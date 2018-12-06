

import equal from "deep-equal";
import { Helmet } from "react-helmet";
import React from "react";


export default class Page extends React.Component{

    shouldComponentUpdate(nextProps){

        return !equal(this.props, nextProps);

    }

    content(){

        return (
            <div>Empty page</div>
        );

    }

    loading(){

        return (
            <div>
                <Helmet>
                    <title>Loading...</title>
                </Helmet>
                <h1>Loading...</h1>
            </div>
        );

    }

    meta(){

        return (
            <Helmet>
                <title>Empty Title</title>
            </Helmet>
        );

    }

    render(){

        if(this.props.loaded === true){

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
