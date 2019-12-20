import React, { Children, useMemo } from 'react';

import classes from './Columns.css';

const Columns = props => {
    const { children, reverse } = props;
    const [content, figure] = Children.toArray(children);

    const columns = useMemo(() => {
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
    }, [content, figure, reverse]);

    return <section className={classes.root}>{columns}</section>;
};

export default Columns;
