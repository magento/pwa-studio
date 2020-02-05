import React from 'react';
import { mergeClasses } from '../../classify';
import defaultClasses from './error.css';
import PropTypes, { shape, string } from 'prop-types';

const ErrorView = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return <div className={classes.root}>{props.children}</div>;
};

ErrorView.propTypes = {
    children: PropTypes.node.isRequired,
    classes: shape({
        root: string
    })
};

export default ErrorView;
