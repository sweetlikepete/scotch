

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { frontloadConnect } from "react-frontload";
import { setRouteData } from "../store/reducers/routes";


const connectRouteProxy = (mod) => {

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

export default connectRouteProxy;
