import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './icon.css';

// TODO: Tree-shaking is broken in react-feather right now, see the issue below.
//   When this is fixed you can import without using full path.
//   https://github.com/carmelopullara/react-feather/issues/6
import ArrowLeft from 'react-feather/dist/icons/arrow-left';
import ChevronDown from 'react-feather/dist/icons/chevron-down';
import ChevronLeft from 'react-feather/dist/icons/chevron-left';
import ChevronRight from 'react-feather/dist/icons/chevron-right';
import Edit2 from 'react-feather/dist/icons/edit-2';
import FastForward from 'react-feather/dist/icons/fast-forward';
import Heart from 'react-feather/dist/icons/heart';
import Lock from 'react-feather/dist/icons/lock';
import Menu from 'react-feather/dist/icons/menu';
import MoreVertical from 'react-feather/dist/icons/more-vertical';
import Rewind from 'react-feather/dist/icons/rewind';
import Search from 'react-feather/dist/icons/search';
import ShoppingCart from 'react-feather/dist/icons/shopping-cart';
import Trash from 'react-feather/dist/icons/trash';
import X from 'react-feather/dist/icons/x';

// Maintain a collection of icons we know we will use. Import and add any icons
// we wish to use to this collection.
const Icons = {
    ArrowLeft,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit2,
    FastForward,
    Heart,
    Lock,
    Menu,
    MoreVertical,
    Rewind,
    Search,
    ShoppingCart,
    Trash,
    X
};

/**
 * The Icon component allows us to wrap each icon with some default styling.
 */
class Icon extends Component {
    static propTypes = {
        name: PropTypes.oneOf([
            'ArrowLeft',
            'ChevronDown',
            'ChevronLeft',
            'ChevronRight',
            'Edit2',
            'FastForward',
            'Heart',
            'Lock',
            'Menu',
            'MoreVertical',
            'Rewind',
            'Search',
            'ShoppingCart',
            'Trash',
            'X'
        ]),
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { attrs, classes, name } = this.props;
        // Use the name provided so that in the case of an unknown icon we throw
        // an appropriate error.
        const IconComponent = Icons[name] || name;
        return (
            <span className={classes.root}>
                <IconComponent
                    size={attrs && attrs.width}
                    color={attrs && attrs.color}
                />
            </span>
        );
    }
}

export default classify(defaultClasses)(Icon);
