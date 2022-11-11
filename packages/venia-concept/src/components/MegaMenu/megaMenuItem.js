import React, { useMemo } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useMegaMenuItem } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenuItem';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './megaMenuItem.module.css';
import Submenu from '@magento/venia-ui/lib/components/MegaMenu/submenu';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Offers from './icons/ICONO_OFERTAS_TERRAZAS.svg';
import Outlet from './icons/ICONO_OUTLET.svg';
import SpareParts from './icons/ICONO_REPUESTOS.svg';

/**
 * The MegaMenuItem component displays mega menu item
 *
 * @param {MegaMenuCategory} props.category
 * @param {int} props.activeCategoryId - id of active category
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const MegaMenuItem = props => {
    const {
        activeCategoryId,
        category,
        mainNavWidth,
        categoryUrlSuffix,
        subMenuState,
        disableFocus,
        onNavigate
    } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const categoryUrl = resourceUrl(`/${category.url_path}${categoryUrlSuffix || ''}`);

    const talonProps = useMegaMenuItem({
        category,
        activeCategoryId,
        subMenuState,
        disableFocus
    });

    const { isFocused, isActive, handleCloseSubMenu, isMenuActive, handleKeyDown } = talonProps;

    const megaMenuItemClassname = isMenuActive ? classes.megaMenuItem_active : classes.megaMenuItem;

    const children = useMemo(() => {
        return category.children.length ? (
            <Submenu
                isFocused={isFocused}
                subMenuState={subMenuState}
                items={category.children}
                mainNavWidth={mainNavWidth}
                handleCloseSubMenu={handleCloseSubMenu}
                categoryUrlSuffix={categoryUrlSuffix}
                onNavigate={onNavigate}
            />
        ) : null;
    }, [category, isFocused, mainNavWidth, subMenuState, handleCloseSubMenu, categoryUrlSuffix, onNavigate]);

    const maybeDownArrowIcon = category.children.length ? (
        <Icon className={classes.arrowDown} src={ArrowDown} size={16} />
    ) : null;

    const linkAttributes = category.children.length
        ? {
              'aria-label': `Category: ${category.name}. ${category.children.length} sub-categories`
          }
        : {};

    const validationSrc = () => {
        if (category.name === 'Ofertas terrazas') {
            return Offers;
        } else if (category.name === 'Outlet') {
            return Outlet;
        } else if (category.name === 'Repuestos') {
            return SpareParts;
        }
    };

    const contentLink =
        category.category_icon != '' ? (
            <img className={classes.iconMenu} src={validationSrc()} alt={category.name} />
        ) : (
            category.name
        );

    return (
        <div className={megaMenuItemClassname}>
            <Link
                {...linkAttributes}
                onKeyDown={handleKeyDown}
                className={isActive ? classes.megaMenuLinkActive : classes.megaMenuLink}
                to={categoryUrl}
                onClick={onNavigate}
            >
                {contentLink}
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
        url_path: PropTypes.string.isRequired
    }).isRequired,
    activeCategoryId: PropTypes.number,
    mainNavWidth: PropTypes.number.isRequired,
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired
};
