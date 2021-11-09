import React from 'react';
import { bool, func, oneOf, shape, string } from 'prop-types';
import {
    Edit2 as Edit2Icon,
    Heart as HeartIcon,
    Trash as TrashIcon
} from 'react-feather';

import { useStyle } from '../../classify';
import Icon from '../Icon';

import defaultClasses from './section.module.css';

const icons = new Map()
    .set('Heart', HeartIcon)
    .set('Edit2', Edit2Icon)
    .set('Trash', TrashIcon);

const Section = props => {
    const {
        icon,
        isFilled,
        onClick,
        text,
        classes: propClasses,
        ...restProps
    } = props;

    const classes = useStyle(defaultClasses, propClasses);
    const iconClasses = { root: classes.icon };
    const iconSrc = icons.get(icon);

    if (isFilled) {
        iconClasses.root = classes.icon_filled;
    }

    return (
        <li className={classes.menuItem} {...restProps}>
            <button
                onMouseDown={onClick}
                data-cy="LegacyMiniCart-Section-button"
            >
                <Icon classes={iconClasses} size={16} src={iconSrc} />
                <span className={classes.text}>{text}</span>
            </button>
        </li>
    );
};

Section.propTypes = {
    classes: shape({
        icon: string,
        icon_filled: string,
        menuItem: string,
        text: string
    }),
    icon: oneOf(['Edit2', 'Heart', 'Trash']),
    isFilled: bool,
    onClick: func,
    text: string
};

export default Section;
