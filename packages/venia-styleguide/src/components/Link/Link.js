import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

import classes from './Link.css';

const VeniaLink = (props, ref) => {
    const { children, href, to, ...rest } = props;
    const destination = to || href;

    return (
        <Link ref={ref} {...rest} to={destination}>
            <span className={classes.root}>{children}</span>
        </Link>
    );
};

export default forwardRef(VeniaLink);
