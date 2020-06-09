export default Suggestions;
declare function Suggestions(props: any): JSX.Element;
declare namespace Suggestions {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            heading: import("prop-types").Requireable<string>;
        }>>;
        export const products: import("prop-types").Requireable<import("prop-types").InferProps<{
            filters: import("prop-types").Requireable<import("prop-types").InferProps<{
                filter_items: import("prop-types").Requireable<import("prop-types").InferProps<{}>[]>;
                name: import("prop-types").Validator<string>;
            }>[]>;
            items: import("prop-types").Requireable<import("prop-types").InferProps<{}>[]>;
        }>>;
        export { string as searchValue };
        export { func as setVisible };
        export { bool as visible };
    }
}
import { string } from "prop-types";
import { func } from "prop-types";
import { bool } from "prop-types";
