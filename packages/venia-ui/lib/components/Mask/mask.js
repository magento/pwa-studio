import React from 'react';
// import PropTypes from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './mask.css';

const Mask = props => {
    const { dismiss, isActive } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const className = isActive ? classes.root_active : classes.root;

    return <button className={className} onClick={dismiss} />;
};

export default Mask;

// /**
//  * A component that masks content.
//  *
//  * @class Mask
//  * @extends {Component}
//  *
//  * @typedef Mask
//  * @kind class component
//  *
//  * @returns {React.Element} A React component that will mask content.
//  */
// class Mask extends Component {
//     /**
//      * Props for {@link Mask}
//      *
//      * @typedef props
//      *
//      * @property {Object} classes An object containing the class names for the
//      * Mask component.
//      * @property {string} classes.root classes for root container
//      * @property {string} classes.root_action classes for root container if
//      * the `isActive` property is `true`.
//      * @property {Function} dismiss the handler for on the `onClick` event
//      * handler.
//      * @property {boolean} isActive whether the mask is in an active state
//      * or not.
//      */
//     static propTypes = {
//         classes: PropTypes.shape({
//             root: PropTypes.string,
//             root_active: PropTypes.string
//         }),
//         dismiss: PropTypes.func,
//         isActive: PropTypes.bool
//     };

//     render() {
//         const { classes, dismiss, isActive } = this.props;
//         const className = isActive ? classes.root_active : classes.root;

//         return <button className={className} onClick={dismiss} />;
//     }
// }

// export default classify(defaultClasses)(Mask);
