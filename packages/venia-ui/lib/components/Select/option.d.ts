export default Option;
declare function Option(props: any): JSX.Element;
declare namespace Option {
    export namespace propTypes {
        export { bool as disabled };
        export const item: import("prop-types").Validator<import("prop-types").InferProps<{
            label: import("prop-types").Requireable<string>;
            value: import("prop-types").Validator<string>;
        }>>;
    }
    export namespace defaultProps {
        export const disabled: boolean;
    }
}
import { bool } from "prop-types";
