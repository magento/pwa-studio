import React from 'react';
import { bool, func, oneOf, shape, string } from 'prop-types';
import {
    Edit2 as Edit2Icon,
    Heart as HeartIcon,
    Trash as TrashIcon
} from 'react-feather';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';

import defaultClasses from './section.css';

const defaultIconAttributes = {
    color: 'rgb(var(--venia-teal))',
    width: '14px',
    height: '14px'
};
const filledIconAttributes = {
    ...defaultIconAttributes,
    fill: 'rgb(var(--venia-teal))'
};
const icons = {
    Heart: HeartIcon,
    Edit2: Edit2Icon,
    Trash: TrashIcon
};

const Section = props => {
    const { icon, isFilled, onClick, text } = props;

    const attributes = isFilled ? filledIconAttributes : defaultIconAttributes;
    const classes = mergeClasses(defaultClasses, props.classes);
    const iconSrc = icons[icon];

    return (
        <li className={classes.menuItem}>
            <button onMouseDown={onClick}>
                {iconSrc && <Icon src={iconSrc} attrs={attributes} />}
                <span className={classes.text}>{text}</span>
            </button>
        </li>
    );
};

Section.propTypes = {
    classes: shape({
        menuItem: string,
        text: string
    }),
    icon: oneOf(Object.keys(icons)),
    isFilled: bool,
    onClick: func,
    text: string
};

export default Section;
