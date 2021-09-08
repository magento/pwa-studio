import React from 'react';
import PropTypes from 'prop-types';

import { useSubMenu } from '@magento/peregrine/lib/talons/MegaMenu/useSubMenu';

import { useStyle } from '../../classify';
import defaultClasses from './submenu.css';
import SubmenuColumn from './submenuColumn';

/**
 * The Submenu component displays submenu in mega menu
 *
 * @param {array} props.items - categories to display
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 */
const Submenu = props => {
    const {
        items,
        mainNavWidth,
        isFocused,
        subMenuState,
        handleCloseSubMenu
    } = props;
    const PADDING_OFFSET = 20;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useSubMenu({
        isFocused,
        subMenuState,
        handleCloseSubMenu
    });

    const { isSubMenuActive } = talonProps;

    const subMenuClassname = isSubMenuActive
        ? classes.submenu_active
        : classes.submenu;

    const subMenus = items.map((category, index) => {
        const keyboardProps =
            index === items.length - 1 ? talonProps.keyboardProps : {};
        return (
            <SubmenuColumn
                index={index}
                keyboardProps={keyboardProps}
                key={category.id}
                category={category}
            />
        );
    });

    return (
        <div className={subMenuClassname}>
            <div
                className={classes.submenuItems}
                style={{ minWidth: mainNavWidth + PADDING_OFFSET }}
            >
                {subMenus}
            </div>
        </div>
    );
};

export default Submenu;

Submenu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            children: PropTypes.array.isRequired,
            id: PropTypes.number.isRequired,
            include_in_menu: PropTypes.number.isRequired,
            isActive: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            path: PropTypes.array.isRequired,
            position: PropTypes.number.isRequired,
            url_path: PropTypes.string.isRequired,
            url_suffix: PropTypes.string
        })
    ).isRequired,
    mainNavWidth: PropTypes.number.isRequired
};
