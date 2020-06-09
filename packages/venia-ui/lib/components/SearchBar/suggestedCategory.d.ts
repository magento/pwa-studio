export default SuggestedCategory;
declare function SuggestedCategory(props: any): JSX.Element;
declare namespace SuggestedCategory {
    export namespace propTypes {
        export { string as categoryId };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            label: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            value: import("prop-types").Requireable<string>;
        }>>;
        export const label: import("prop-types").Validator<string>;
        export { func as onNavigate };
        export const value: import("prop-types").Validator<string>;
    }
}
import { string } from "prop-types";
import { func } from "prop-types";
