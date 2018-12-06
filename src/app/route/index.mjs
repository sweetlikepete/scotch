

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import equal from "deep-equal";
import { frontloadConnect } from "react-frontload";
import loadable from "react-loadable";
import logger from "../../logger";
import React from "react";
import { setLoaded } from "../../store/reducers/loaded";


export default class Route extends React.Component{

    static constructor(){

        this.page = loadable({
            loader: () => new Promise((resolve) => {

                this.loader(this.id).then((mod) => {

                    resolve(mod.default);

                }).catch(logger.error);

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

    shouldComponentUpdate(nextProps){

        return !equal(this.props, nextProps);

    }

    render(){

        const Page = connect(
            (state, props) => ({
                ...this.mapStateToProps ? this.mapStateToProps(state, props) : {},
                loaded: state.loaded === props.match.url
            }),
            (dispatch) => bindActionCreators({
                ...this.actions || {},
                setLoaded
            }, dispatch)
        )(frontloadConnect(
            async (props) => {

                if(!props.loaded){

                    if(this.load){

                        await this.load();

                    }

                    /*
                     * If you're on the client and the current url is the same as
                     * the url the request started with (no navigation has occurred)
                     * set the current loaded page url. This prevents the completion of
                     * a load request from one url blocking the load state of another
                     * page load that happened during the first page load.
                     */
                    if(
                        typeof window === "undefined" ||
                        window.location.pathname === props.match.url
                    ){

                        props.setLoaded(props.match.url);

                    }

                }

            },
            {
                onMount: true,
                onUpdate: false
            }
        )(this.constructor.page));

        return <Page { ...this.props } />;

    }

}
