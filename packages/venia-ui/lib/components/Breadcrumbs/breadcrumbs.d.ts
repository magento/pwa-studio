export default Breadcrumbs;
/**
 * Breadcrumbs! Generates a sorted display of category links.
 *
 * @param {String} props.categoryId the id of the category for which to generate breadcrumbs
 * @param {String} props.currentProduct the name of the product we're currently on, if any.
 */
declare function Breadcrumbs(props: any): JSX.Element;
declare namespace Breadcrumbs {
    export namespace propTypes {
        export const categoryId: import("prop-types").Validator<number>;
        export { string as currentProduct };
    }
}
import { string } from "prop-types";
