import React from 'react';

import classes from './ButtonGroup.css';

const ButtonGroup = props => {
    return <div className={classes.root}>{props.children}</div>;
};

export default ButtonGroup;
