import React, { useEffect } from 'react';

import Anchor from '../Anchor';
import { useArticleContext } from '../Article';
import classes from './Section.css';

const Section = props => {
    const { children, title } = props;
    const id = title.replace(/\s/g, '-') || '';
    const fragment = `#${id}`;
    const [, addSection] = useArticleContext();

    useEffect(() => {
        addSection(title, id);
    }, [addSection, id, title]);

    return (
        <section className={classes.root}>
            <h2 className={classes.heading}>
                <span className={classes.title}>{title}</span>
                <span className={classes.anchor}>
                    <Anchor fragment={fragment} id={id} />
                </span>
            </h2>
            <hr className={classes.rule} />
            {children}
        </section>
    );
};

export default Section;
