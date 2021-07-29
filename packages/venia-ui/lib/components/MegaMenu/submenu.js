import React, { useCallback } from 'react';
import { useKeyboard } from 'react-aria';
import PropTypes from 'prop-types';

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

    const { keyboardProps } = useKeyboard({
        onKeyDown: e => {
            //checking for Tab without Shift
            if (e.keyCode == 9 && !e.shiftKey) {
                e.target.addEventListener('blur', handleCloseSubMenu());
            }
        }
    });

    const subMenuClassname = useCallback(() => {
        if (isFocused) {
            if (subMenuState) {
                return classes.submenu_active;
            }
        }
        return classes.submenu;
    }, [isFocused, subMenuState]);

    const subMenus = items.map((category, index) => {
        if (index === items.length - 1) {
            return (
                <SubmenuColumn
                    index={index}
                    keyboardProps={keyboardProps}
                    key={category.id}
                    category={category}
                />
            );
        } else {
            return (
                <SubmenuColumn
                    index={index}
                    keyboardProps={{}}
                    key={category.id}
                    category={category}
                />
            );
        }
    });

    return (
        <div className={subMenuClassname()}>
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
