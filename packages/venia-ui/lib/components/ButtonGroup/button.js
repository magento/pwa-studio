import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './button.css';

const Button = props => {
    const { children, classes: propClasses, ...rest } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <button {...rest} className={classes.root}>
            <span className={classes.content}>{children}</span>
        </button>
    );
};

Button.propTypes = {
    classes: shape({
        content: string,
        root: string
    }).isRequired
};

export default Button;
