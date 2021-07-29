import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

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
    const { activeCategoryId, category, mainNavWidth, subMenuState } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const categoryUrl = resourceUrl(
        `/${category.url_path}${category.url_suffix || ''}`
    );
    const [isFocused, setIsFocused] = useState(false);

    const isActive = category.id === activeCategoryId;

    const handleCloseSubMenu = useCallback(() => {
        setIsFocused(false);
    }, [setIsFocused, category]);

    const megaMenuItemClassname = useCallback(() => {
        if (isFocused) {
            if (subMenuState) {
                return classes.megaMenuItem_active;
            }
        }
        return classes.megaMenuItem;
    }, [isFocused, subMenuState]);

    const a11yClick = e => {
        //checking down arrow or space
        if (e.keyCode === 32 || e.keyCode === 40) {
            return true;
        }
        //checking up arrow or escape
        if (e.keyCode === 38 || e.keyCode === 27) {
            setIsFocused(false);
        }
    };

    const toggleSubMenu = e => {
        e.preventDefault();
        if (
            category.children.length &&
            !(e.keyCode === 38 || e.keyCode === 27)
        ) {
            setIsFocused(true);
        } else {
            setIsFocused(false);
        }
    };

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
    }, [category, isFocused, mainNavWidth, subMenuState]);

    return (
        <div className={megaMenuItemClassname()}>
            <Link
                onKeyDown={e => {
                    a11yClick(e) && toggleSubMenu(e);
                }}
                className={
                    isActive ? classes.megaMenuLinkActive : classes.megaMenuLink
                }
                to={categoryUrl}
            >
                {category.name}
                {category.children.length ? (
                    <Icon
                        className={classes.arrowDown}
                        src={ArrowDown}
                        size={17}
                        aria-label={
                            'Category: ' +
                            category.name +
                            '. ' +
                            category.children.length +
                            ' sub-categories'
                        }
                    />
                ) : (
                    ''
                )}
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
