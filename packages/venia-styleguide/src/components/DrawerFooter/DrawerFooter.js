import React from 'react';

import classes from './DrawerFooter.css';

const DrawerFooter = props => {
    return <div className={classes.root}>{props.children}</div>;
};

export default DrawerFooter;
