import React, { Component } from 'react';
import { func, object, oneOf, shape, string } from 'prop-types';
import Icon from 'src/components/Icon';
import HeartIcon from 'react-feather/dist/icons/heart';
import Edit2Icon from 'react-feather/dist/icons/edit-2';
import TrashIcon from 'react-feather/dist/icons/trash';
import classify from 'src/classify';
import defaultClasses from './section.css';

const SectionIcons = {
    Heart: HeartIcon,
    Edit2: Edit2Icon,
    Trash: TrashIcon
};

class Section extends Component {
    static propTypes = {
        classes: shape({
            menuItem: string,
            text: string
        }),
        icon: oneOf(['Heart', 'Edit2', 'Trash']),
        iconAttributes: object,
        onClick: func,
        text: string
    };

    get icon() {
        const { icon } = this.props;
        const defaultAttributes = {
            color: 'rgb(var(--venia-teal))',
            width: '14px',
            height: '14px'
        };
        const iconAttributes = this.props.iconAttributes
            ? Object.assign(defaultAttributes, this.props.iconAttributes)
            : defaultAttributes;

        return icon ? (
            <Icon src={SectionIcons[icon]} attrs={iconAttributes} />
        ) : null;
    }

    render() {
        const { icon } = this;
        const { classes, onClick, text } = this.props;

        return (
            <li className={classes.menuItem}>
                <button onClick={onClick}>
                    {icon}
                    <span className={classes.text}>{text}</span>
                </button>
            </li>
        );
    }
}

export default classify(defaultClasses)(Section);
