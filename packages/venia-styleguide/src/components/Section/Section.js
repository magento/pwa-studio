import React from 'react';

import Anchor from '../Anchor';
import classes from './Section.css';

const Section = props => {
    const { children, fragment, id, title } = props;

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
