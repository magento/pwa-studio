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
    const target = useMemo(
        () =>
            container instanceof HTMLElement
                ? container
                : document.getElementById('root'),
        [container]
    );

    return createPortal(children, target);
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
