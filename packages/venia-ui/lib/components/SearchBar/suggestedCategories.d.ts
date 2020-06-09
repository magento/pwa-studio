export default SuggestedCategories;
declare function SuggestedCategories(props: any): JSX.Element;
declare namespace SuggestedCategories {
    export namespace defaultProps {
        export const limit: number;
    }
    export namespace propTypes {
        export const categories: import("prop-types").Validator<import("prop-types").InferProps<{
            label: import("prop-types").Validator<string>;
            value: import("prop-types").Validator<string>;
        }>[]>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            item: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        const limit_1: import("prop-types").Validator<number>;
        export { limit_1 as limit };
        export { func as onNavigate };
        export { string as value };
    }
}
import { func } from "prop-types";
import { string } from "prop-types";
