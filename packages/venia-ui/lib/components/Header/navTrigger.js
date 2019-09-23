import React, { useCallback } from 'react';
import { node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './navTrigger.css';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const Trigger = props => {
    const [, { toggleDrawer }] = useAppContext();

    const handleOpenNavigation = useCallback(() => {
        toggleDrawer('nav');
    }, [toggleDrawer]);

    const classes = mergeClasses(defaultClasses, props.classes);
    const { children } = props;
    return (
        <button
            className={classes.root}
            aria-label="Toggle navigation panel"
            onClick={handleOpenNavigation}
        >
            {children}
        </button>
    );
};

Trigger.propTypes = {
    children: node,
    classes: shape({
        root: string
    })
};

export default Trigger;
