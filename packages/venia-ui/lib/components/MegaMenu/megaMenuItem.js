import React, { useMemo } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useMegaMenuItem } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenuItem';

import { useStyle } from '../../classify';
import defaultClasses from './megaMenuItem.css';
import Submenu from './submenu';
import Icon from '../Icon';

/**
 * The MegaMenuItem component displays mega menu item
 *
 * @param {MegaMenuCategory} props.category
 * @param {int} props.activeCategoryId - id of active category
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 */
const MegaMenuItem = props => {
    const {
        activeCategoryId,
        category,
        mainNavWidth,
        subMenuState,
        disableFocus
    } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const categoryUrl = resourceUrl(
        `/${category.url_path}${category.url_suffix || ''}`
    );

    const talonProps = useMegaMenuItem({
        category,
        activeCategoryId,
        subMenuState,
        disableFocus
    });

    const {
        isFocused,
        isActive,
        handleCloseSubMenu,
        isMenuActive,
        handleKeyDown
    } = talonProps;

    const megaMenuItemClassname = isMenuActive
        ? classes.megaMenuItem_active
        : classes.megaMenuItem;

    const children = useMemo(() => {
        return category.children.length ? (
            <Submenu
                isFocused={isFocused}
                subMenuState={subMenuState}
                items={category.children}
                mainNavWidth={mainNavWidth}
                handleCloseSubMenu={handleCloseSubMenu}
            />
        ) : null;
    }, [category, isFocused, mainNavWidth, subMenuState, handleCloseSubMenu]);

    const maybeDownArrowIcon = category.children.length ? (
        <Icon
            className={classes.arrowDown}
            src={ArrowDown}
            size={16}
            aria-label={
                'Category: ' +
                category.name +
                '. ' +
                category.children.length +
                ' sub-categories'
            }
        />
    ) : null;

    return (
        <div className={megaMenuItemClassname}>
            <Link
                onKeyDown={handleKeyDown}
                className={
                    isActive ? classes.megaMenuLinkActive : classes.megaMenuLink
                }
                to={categoryUrl}
            >
                {category.name}
                {maybeDownArrowIcon}
            </Link>
            {children}
        </div>
    );
};

export default MegaMenuItem;

MegaMenuItem.propTypes = {
    category: PropTypes.shape({
        children: PropTypes.array,
        id: PropTypes.number.isRequired,
        include_in_menu: PropTypes.number,
        isActive: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.array.isRequired,
        position: PropTypes.number.isRequired,
        url_path: PropTypes.string.isRequired,
        url_suffix: PropTypes.string
    }).isRequired,
    activeCategoryId: PropTypes.number,
    mainNavWidth: PropTypes.number.isRequired
};
