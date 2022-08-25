import React from 'react';
import { shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './button.module.css';

const Button = props => {
    const { children, classes: propClasses, ...rest } = props;
    const classes = useStyle(defaultClasses, propClasses);

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
