export default Portal;
/**
 * A component that renders content into a DOM node that exists
 * outside of the DOM hierarchy of the parent component.
 */
export type Portal = any;
/**
 * Props for {@link Portal}
 */
export type props = {
    /**
     * any elements that will be child
     * elements inside the modal.
     */
    children: any;
    /**
     * the container element (a DOM element)
     * where the children will be rendered.
     */
    container: any;
};
/**
 * A component that renders content into a DOM node that exists
 * outside of the DOM hierarchy of the parent component.
 * @see https://reactjs.org/docs/portals.html
 *
 * @typedef Portal
 * @kind functional component
 *
 * @param {ReactNodeLike}   children  - React child elements
 * @param {Object}          container - The DOM node to render the children in
 *
 * @returns {React.ReactPortal} The React portal.
 */
declare function Portal({ children, container }: any): React.ReactPortal;
declare namespace Portal {
    export namespace propTypes {
        export { node as children };
        export { object as container };
    }
}
import { node } from "prop-types";
import { object } from "prop-types";
