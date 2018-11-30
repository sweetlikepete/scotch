

import loadable from "react-loadable";
import React from "react";


export default class Route extends React.Component{

    static constructor(){

        this.page = loadable({
            loader: () => new Promise((resolve) => {

                this.loader(this.id).then((mod) => {

                    resolve(mod.default);

                }).catch((err) => {

                    console.log(err);

                });

            }),
            loading: this.loading,
            modules: this.modules(this.id),
            render: this.render
        });

    }

    static exact = true;

    static render = (Page, props) => <Page { ...props } />;

    render(props){

        const Page = this.constructor.page;

        return <Page { ...props } />;

    }

}
