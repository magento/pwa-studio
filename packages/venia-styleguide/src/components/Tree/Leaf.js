import React, { useMemo } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import finalizeClasses from '../../util/finalizeClasses';
import classes from './Leaf.css';

const Leaf = props => {
    const { label, slug } = props;
    const destination = `/page/${slug}`;
    const { isExact } = useRouteMatch(destination) || {};
    const active = !!isExact;

    const finalClasses = useMemo(() => finalizeClasses(classes, { active }), [
        active
    ]);

    return (
        <Link className={finalClasses.get('root')} to={destination}>
            {label}
        </Link>
    );
};

export default Leaf;
