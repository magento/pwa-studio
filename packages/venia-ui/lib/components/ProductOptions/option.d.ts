export default Option;
declare function Option(props: any): JSX.Element;
declare namespace Option {
    export namespace propTypes {
        export const attribute_code: import("prop-types").Validator<string>;
        export { string as attribute_id };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            title: import("prop-types").Requireable<string>;
        }>>;
        export const label: import("prop-types").Validator<string>;
        export { func as onSelectionChange };
        export const selectedValue: import("prop-types").Requireable<string | number>;
        export const values: import("prop-types").Validator<object[]>;
    }
}
import { string } from "prop-types";
import { func } from "prop-types";
