import React, { useEffect } from 'react';

import classes from './Article.css';

const Article = props => {
    const { children, title } = props;

    useEffect(() => {
        document.title = `${title} – Venia Styleguide`;
    }, [title]);

    return (
        <article>
            <h1 className={classes.title}>{title}</h1>
            {children}
        </article>
    );
};

export default Article;
