import React, { Component } from 'react';
import classify from '../../classify';
import defaultClasses from './navButton.css';
import Icon from '../Icon';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    FastForward as FastForwardIcon,
    Rewind as RewindIcon
} from 'react-feather';

const NavIcons = {
    Rewind: RewindIcon,
    ChevronLeft: ChevronLeftIcon,
    ChevronRight: ChevronRightIcon,
    FastForward: FastForwardIcon
};

const defaultSkipAttributes = {
    width: '19px',
    height: '19px'
};

const activeFill = {
    fill: '#000'
};

const inactiveFill = {
    fill: '#999'
};

class NavButton extends Component {
    static defaultProps = {
        buttonLabel: 'move to another page'
    };

    render() {
        const { classes, name, active, onClick, buttonLabel } = this.props;
        let attrs;
        // The chevron icon does not have a fill or any sizing issues that
        // need to be handled with attributes in props
        if (name.includes('Chevron')) {
            attrs = {};
        } else {
            attrs = active
                ? { ...defaultSkipAttributes, ...activeFill }
                : { ...defaultSkipAttributes, ...inactiveFill };
        }

        const className = active ? classes.buttonArrow : classes.buttonInactive;

        return (
            <button
                className={className}
                aria-label={buttonLabel}
                onClick={onClick}
            >
                <Icon src={NavIcons[name]} attrs={attrs} />
            </button>
        );
    }
}

export default classify(defaultClasses)(NavButton);
