export default Label;
declare function Label(props: any): React.DetailedReactHTMLElement<any, HTMLElement>;
declare namespace Label {
    export namespace propTypes {
        export { node as children };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { bool as plain };
    }
}
import React from "react";
import { node } from "prop-types";
import { bool } from "prop-types";
