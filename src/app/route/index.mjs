

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import equal from "deep-equal";
import { frontloadConnect } from "react-frontload";
import loadable from "react-loadable";
import React from "react";
import { setLoaded } from "../../store/reducers/loaded";


export default class Route extends React.Component{

    static constructor(){

        this.page = loadable({
            loader: () => new Promise((resolve) => {

                this.loader(this.id).then((mod) => {

                    const frontload = this.load ? frontloadConnect(
                        async (props) => {

                            await this.load();

                            console.log(props);

                            props.setLoaded(props.match.url);

                        },
                        {
                            onMount: true,
                            onUpdate: false
                        }
                    )(mod.default) : mod.default;

                    const Component = connect(
                        (state, props) => ({
                            ...this.mapStateToProps ? this.mapStateToProps(state, props) : {},
                            loaded: state.loaded[props.match.url] || false
                        }),
                        (dispatch) => bindActionCreators({
                            ...this.actions || {},
                            setLoaded
                        }, dispatch)
                    )(frontload);

                    resolve(Component);

                }).catch(console.log);

            }),
            loading: this.loading,
            modules: this.modules(this.id),
            render: this.render
        });

    }


    static exact = true;

    static strict = true;

    static sensitive = true;

    static modules = () => {

        throw new Error("static method modules not implemented");

    };

    static render = (Page, props) => <Page { ...props } />;

    static async load(){

        await new Promise((resolve) => {

            resolve();

        });

    }

    shouldComponentUpdate(nextProps){

        return !equal(this.props, nextProps);

    }

    render(){

        const Page = this.constructor.page;

        return <Page { ...this.props } />;

    }

}
