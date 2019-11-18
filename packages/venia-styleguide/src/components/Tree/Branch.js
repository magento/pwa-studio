import React from 'react';

import Leaf from './Leaf';
import classes from './Branch.css';

const Branch = props => {
    const { items, label, pages } = props;

    const leaves = Array.from(items, key => (
        <li key={key}>
            <Leaf label={pages.get(key)} slug={key} />
        </li>
    ));

    return (
        <div className={classes.root}>
            <button className={classes.trigger} type="button">
                <span className={classes.label}>{label}</span>
            </button>
            <ul className={classes.leaves}>{leaves}</ul>
        </div>
    );
};

export default Branch;
