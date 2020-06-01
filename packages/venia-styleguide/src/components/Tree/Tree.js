import React from 'react';

import { useRoutes } from '../Routes';
import Branch from './Branch';
import classes from './Tree.css';

const LEVEL = 1;

const Tree = () => {
    const { groups, pages } = useRoutes();
    const style = { '--level': LEVEL };

    const branches = Array.from(groups, ([key, group]) => (
        <Branch key={key} level={LEVEL} pages={pages} {...group} />
    ));

    return (
        <nav className={classes.root} style={style}>
            {branches}
        </nav>
    );
};

export default Tree;
