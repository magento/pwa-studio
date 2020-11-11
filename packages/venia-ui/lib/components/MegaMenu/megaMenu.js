import React from 'react';
import { useMegaMenu } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu';
import { mergeClasses } from '../../classify';
import defaultClasses from './megaMenu.css';
import MegaMenuItem from './megaMenuItem';
import PropTypes from 'prop-types';

/**
 * The MegaMenu component displays menu with categories on desktop devices
 *
 * @param {MegaMenuCategory} props.megaMenuData - categories
 * @param {bool} props.activeCategoryId - id of active category
 */
const MegaMenu = props => {
    const { megaMenuData, activeCategoryId } = useMegaMenu();
    const classes = mergeClasses(defaultClasses, props.classes);

    const items = megaMenuData.children
        ? megaMenuData.children.map(category => {
              return (
                  <MegaMenuItem
                      category={category}
                      activeCategoryId={activeCategoryId}
                      rootCategoryName={megaMenuData.name}
                      key={category.id}
                  />
              );
          })
        : null;

    return (
        <nav className={classes.megaMenu} role="navigation">
            {items}
        </nav>
    );
};

export default MegaMenu;

MegaMenu.propTypes = {
    megaMenuData: PropTypes.object,
    activeCategoryId: PropTypes.number
};
