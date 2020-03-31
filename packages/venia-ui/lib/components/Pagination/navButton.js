import React from 'react';
import { shape, string } from 'prop-types';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    FastForward as FastForwardIcon,
    Rewind as RewindIcon
} from 'react-feather';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './navButton.css';

const icons = new Map()
    .set('ChevronLeft', ChevronLeftIcon)
    .set('ChevronRight', ChevronRightIcon)
    .set('FastForward', FastForwardIcon)
    .set('Rewind', RewindIcon);

const NavButton = props => {
    const { active, buttonLabel, name, onClick } = props;
    const iconSrc = icons.get(name);
    const classes = mergeClasses(defaultClasses, props.classes);

    const rootClass = active ? classes.root : classes.root_disabled;
    const iconClass = active ? classes.icon : classes.icon_disabled;

    return (
        <button
            aria-label={buttonLabel}
            className={rootClass}
            disabled={!active}
            onClick={onClick}
        >
            <Icon className={iconClass} size={20} src={iconSrc} />
        </button>
    );
};

export default NavButton;

NavButton.propTypes = {
    classes: shape({
        icon: string,
        icon_disabled: string,
        root: string,
        root_disabled: string
    })
};

NavButton.defaultProps = {
    buttonLabel: 'move to another page'
};
