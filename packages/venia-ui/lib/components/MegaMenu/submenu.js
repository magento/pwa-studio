import React from 'react';
import { mergeClasses } from '../../classify';
import defaultClasses from './submenu.css';
import SubmenuColumn from './submenuColumn';
import PropTypes from 'prop-types';

/**
 * The Submenu component displays submenu in mega menu
 *
 * @param {array} props.items - categories to display
 * @param {String} props.rootCategoryName - name of the root category
 * @param {String} props.firstLevelCategoryName - name of the first level category
 */
const Submenu = props => {
    const { items, rootCategoryName, firstLevelCategoryName } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const subMenus = items.map(category => {
        return <SubmenuColumn category={category} key={category.id} />;
    });

    const breadcrumbs = `${rootCategoryName} / ${firstLevelCategoryName}`;

    return (
        <div className={classes.submenu}>
            <div className={classes.submenuContainer}>
                <div className={classes.breadcrumb}>{breadcrumbs}</div>
                <div className={classes.submenus}>{subMenus}</div>
            </div>
        </div>
    );
};

export default Submenu;

Submenu.propTypes = {
    items: PropTypes.array.isRequired,
    rootCategoryName: PropTypes.string.isRequired,
    firstLevelCategoryName: PropTypes.string.isRequired
};
