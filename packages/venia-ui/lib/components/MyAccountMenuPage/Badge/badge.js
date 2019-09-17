import React from 'react';
import { node, shape, string } from 'prop-types';
import { mergeClasses } from '../../../classify';
import defaultClasses from './badge.css';

const Badge = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { children } = props;

    return (
        <span className={classes.root}>
            <span className={classes.text}>{children}</span>
        </span>
    );
};

Badge.propTypes = {
    classes: shape({
        root: string,
        text: string
    }),
    children: node
};
export default Badge;
