export default NavHeader;
declare function NavHeader(props: any): JSX.Element;
declare namespace NavHeader {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            title: import("prop-types").Requireable<string>;
        }>>;
        export { bool as isTopLevel };
        export const onBack: import("prop-types").Validator<(...args: any[]) => any>;
        export const onClose: import("prop-types").Validator<(...args: any[]) => any>;
        export const view: import("prop-types").Validator<string>;
    }
}
import { bool } from "prop-types";
