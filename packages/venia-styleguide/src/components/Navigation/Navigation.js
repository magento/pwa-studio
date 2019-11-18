import React, { Fragment, useCallback, useMemo, useState } from 'react';

import finalizeClasses from '../../util/finalizeClasses';
import Tree from '../Tree';
import Branding from './Branding';
import classes from './Navigation.css';

const Navigation = () => {
    const [expanded, setExpanded] = useState(false);

    const finalClasses = useMemo(() => finalizeClasses(classes, { expanded }), [
        expanded
    ]);

    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    return (
        <Fragment>
            <header className={classes.header}>
                <button aria-label="toggle navigation" onClick={handleClick}>
                    {'Toggle'}
                </button>
            </header>
            <button
                aria-label="hide navigation"
                className={finalClasses.get('mask')}
                onClick={handleClick}
            />
            <aside className={finalClasses.get('rail')}>
                <Branding />
                <Tree />
            </aside>
        </Fragment>
    );
};

export default Navigation;
