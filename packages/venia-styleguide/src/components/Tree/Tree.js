import React from 'react';

import { useRoutes } from '../Routes';
import Branch from './Branch';
import classes from './Tree.css';

const Tree = () => {
    const { groups, pages } = useRoutes();

    const branches = Array.from(groups, ([key, group]) => (
        <Branch key={key} pages={pages} {...group} />
    ));

    return <nav className={classes.root}>{branches}</nav>;
};

export default Tree;
