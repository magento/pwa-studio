import React from 'react';

import classes from './Paragraph.css';

const Paragraph = props => {
    const { children } = props;

    return <p className={classes.root}>{children}</p>;
};

export default Paragraph;
