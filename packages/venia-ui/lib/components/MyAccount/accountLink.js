import React, { useCallback } from 'react';
import { arrayOf, func, node, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import Button from '../Button';

import defaultClasses from './accountLink.module.css';

const AccountLink = props => {
    const { children, onClick } = props;
    const [icon, text] = children;
    const classes = useStyle(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        if (typeof onClick === 'function') {
            onClick();
        }
    }, [onClick]);

    return (
        <Button classes={classes} onClick={handleClick}>
            <span className={classes.icon}>{icon}</span>
            <span className={classes.text}>{text}</span>
        </Button>
    );
};

export default AccountLink;

AccountLink.propTypes = {
    children: arrayOf(node).isRequired,
    classes: shape({
        content: string,
        icon: string,
        root: string,
        root_highPriority: string,
        root_lowPriority: string,
        root_normalPriority: string,
        text: string
    }),
    onClick: func
};
