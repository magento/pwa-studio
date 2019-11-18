import React from 'react';

import classes from './Section.css';

const anchorText = '#';

const Section = props => {
    const { children, fragment, title } = props;

    return (
        <section className={classes.root}>
            <h2 className={classes.heading}>
                <span className={classes.title}>{title}</span>
                <a className={classes.anchor} href={`#${fragment || ''}`}>
                    {anchorText}
                </a>
            </h2>
            <hr className={classes.rule} />
            {children}
        </section>
    );
};

export default Section;
