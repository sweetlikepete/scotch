

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

        return <h1>Loading...</h1>;

    }

    meta(){

        return (
            <Helmet>
                <title>Empty Title</title>
            </Helmet>
        );

    }

    render(){

        console.log(["base props", this.props]);

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
