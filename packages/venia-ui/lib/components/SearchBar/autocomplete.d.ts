export default Autocomplete;
declare function Autocomplete(props: any): JSX.Element;
declare namespace Autocomplete {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            message: import("prop-types").Requireable<string>;
            root_hidden: import("prop-types").Requireable<string>;
            root_visible: import("prop-types").Requireable<string>;
            suggestions: import("prop-types").Requireable<string>;
        }>>;
        export { func as setVisible };
        export { bool as visible };
    }
}
import { func } from "prop-types";
import { bool } from "prop-types";
