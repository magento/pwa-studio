import React from 'react';
import { Link, resourceUrl } from '../../drivers';
import { mergeClasses } from '../../classify';
import defaultClasses from './megaMenuItem.css';
import Submenu from './submenu';
import PropTypes from 'prop-types';

/**
 * The MegaMenuItem component displays mega menu item
 *
 * @param {MegaMenuCategory} props.category
 * @param {bool} props.activeCategoryId - id of active category
 * @param {String} props.rootCategoryName - name of the root category
 */
const MegaMenuItem = props => {
    const { category, activeCategoryId, rootCategoryName } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const categoryUrl = resourceUrl(
        `/${category.url_path}${category.url_suffix}`
    );

    const children = category.children.length ? (
        <Submenu
            items={category.children}
            rootCategoryName={rootCategoryName}
            firstLevelCategoryName={category.name}
        />
    ) : null;
    const isActive = category.id === activeCategoryId;

    return (
        <div className={classes.megaMenuItem}>
            <Link
                className={
                    isActive ? classes.megaMenuLinkActive : classes.megaMenuLink
                }
                to={categoryUrl}
            >
                {category.name}
            </Link>
            {children}
        </div>
    );
};

export default MegaMenuItem;

MegaMenuItem.propTypes = {
    category: PropTypes.object.isRequired,
    activeCategoryId: PropTypes.number,
    rootCategoryName: PropTypes.string.isRequired
};
