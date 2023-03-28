import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { node, object } from 'prop-types';

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
const Portal = ({ children, container }) => {
    // a component must always call the same hooks, so no early returns
    const target = useMemo(() => {
        return IS_SERVER
            ? null
            : container instanceof HTMLElement
            ? container
            : document.getElementById('root');
    }, [container]);

    // TODO: replace direct usage of Portal with something SSR-compatible
    return IS_SERVER ? null : createPortal(children, target);
};

export default Portal;

/**
 * Props for {@link Portal}
 *
 * @typedef props
 *
 * @property {ReactNodeLike} children any elements that will be child
 * elements inside the modal.
 * @property {Object} container the container element (a DOM element)
 * where the children will be rendered.
 */
Portal.propTypes = {
    children: node,
    container: object
};
