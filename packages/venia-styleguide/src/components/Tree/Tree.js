import React from 'react';

import { groups } from '../../routes.yml';
import Branch from './Branch';

const routeMap = new Map(groups);

const Tree = () => {
    const branches = Array.from(routeMap, ([key, group]) => (
        <Branch key={key} {...group} />
    ));

    return <nav>{branches}</nav>;
};

export default Tree;
