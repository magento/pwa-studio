import React from 'react';
import { mergeClasses } from '../../classify';
import defaultClasses from './submenu.css';
import SubmenuColumn from './submenuColumn';
import PropTypes from 'prop-types';

/**
 * The Submenu component displays submenu in mega menu
 *
 * @param {array} props.items - categories to display
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 */
const Submenu = props => {
    const { items, mainNavWidth } = props;
    const PADDING_OFFSET = 20;
    const classes = mergeClasses(defaultClasses, props.classes);

    const subMenus = items.map(category => {
        return <SubmenuColumn category={category} key={category.id} />;
    });

    return (
        <div className={classes.submenu}>
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
    items: PropTypes.array.isRequired,
    mainNavWidth: PropTypes.number.isRequired
};
