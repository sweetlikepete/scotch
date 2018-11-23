

declare module "react-frontload" {

    import { Component } from "react";

    export function frontloadConnect(
        frontload: (props: Object) => Promise<void>,
        options?: {
            noServerRender: boolean;
            onMount: boolean;
            onUpdate: boolean;
        }
    ): Component;

}
