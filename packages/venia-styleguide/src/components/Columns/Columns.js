import React, { Children } from 'react';

import classes from './Columns.css';

const Columns = props => {
    const { children } = props;
    const [content, figure] = Children.toArray(children);

    return (
        <section className={classes.root}>
            <div className={classes.content}>{content}</div>
            <figure className={classes.figure}>{figure}</figure>
        </section>
    );
};

export default Columns;
