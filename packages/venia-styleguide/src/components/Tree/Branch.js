import React from 'react';

import Leaf from './Leaf';
import classes from './Branch.css';

const Branch = props => {
    const { items, label, level, pages } = props;
    const nextLevel = level + 1;
    const style = { '--level': nextLevel };

    const leaves = Array.from(items, item => {
        const isLeaf = typeof item === 'string';
        const key = isLeaf ? item : item.group.label;

        const child = isLeaf ? (
            <Leaf label={pages.get(item)} slug={item} />
        ) : (
            <Branch level={nextLevel} pages={pages} {...item.group} />
        );

        return (
            <li key={key} className={classes.leaf}>
                {child}
            </li>
        );
    });

    return (
        <div className={classes.root}>
            <button className={classes.trigger} type="button">
                <span className={classes.label}>{label}</span>
            </button>
            <ul className={classes.leaves} style={style}>
                {leaves}
            </ul>
        </div>
    );
};

export default Branch;
