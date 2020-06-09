export default CMSPage;
declare function CMSPage(props: any): JSX.Element;
declare namespace CMSPage {
    export namespace propTypes {
        export { number as id };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            heading: import("prop-types").Requireable<string>;
        }>>;
    }
}
import { number } from "prop-types";
