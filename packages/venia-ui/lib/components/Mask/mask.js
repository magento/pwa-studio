import React from 'react';
import { useStyle } from '../../classify';
import defaultClasses from './mask.css';

/**
 * A component that masks content.
 *
 * @class Mask
 * @extends {Component}
 *
 * @typedef Mask
 * @kind class component
 *
 * @returns {React.Element} A React component that will mask content.
 */
const Mask = props => {
    const { dismiss, isActive } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const className = isActive ? classes.root_active : classes.root;

    return <button className={className} onClick={dismiss} />;
};

export default Mask;
