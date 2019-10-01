import React from 'react';
import { node, shape, string } from 'prop-types';
import { Menu as MenuIcon } from 'react-feather';

import Icon from '../Icon';
import { mergeClasses } from '../../classify';
import defaultClasses from './navTrigger.css';
import { useNavigationTrigger } from '@magento/peregrine/lib/talons/Header/useNavigationTrigger';

/**
 * A component that toggles the navigation menu.
 */
const NavigationTrigger = props => {
    const { handleOpenNavigation } = useNavigationTrigger();

    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <button
            className={classes.root}
            aria-label="Toggle navigation panel"
            onClick={handleOpenNavigation}
        >
            <Icon src={MenuIcon} />
        </button>
    );
};

NavigationTrigger.propTypes = {
    children: node,
    classes: shape({
        root: string
    })
};

export default NavigationTrigger;
