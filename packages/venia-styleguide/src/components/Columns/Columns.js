import React, { Children, useMemo } from 'react';

import classes from './Columns.css';

const Columns = props => {
    const { children, reverse } = props;

    const columns = useMemo(() => {
        const [content, figure] = Children.toArray(children);

        const contentEl = (
            <div key="content" className={classes.content}>
                {content}
            </div>
        );

        const figureEl = (
            <figure key="figure" className={classes.figure}>
                {figure}
            </figure>
        );

        return reverse ? [figureEl, contentEl] : [contentEl, figureEl];
    }, [children, reverse]);

    return <section className={classes.root}>{columns}</section>;
};

export default Columns;
