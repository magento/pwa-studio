export default Main;
declare function Main(props: any): JSX.Element;
declare namespace Main {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            page: import("prop-types").Requireable<string>;
            page_masked: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_masked: import("prop-types").Requireable<string>;
        }>>;
        export { bool as isMasked };
    }
}
import { bool } from "prop-types";
