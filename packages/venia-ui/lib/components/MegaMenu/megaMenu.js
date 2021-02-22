import React, { useRef, useState, useEffect } from 'react';
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

    const mainNavRef = useRef(null);
    const [mainNavWidth, setMainNavWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const navWidth = mainNavRef.current
                ? mainNavRef.current.offsetWidth
                : null;

            setMainNavWidth(navWidth);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    const items = megaMenuData.children
        ? megaMenuData.children.map(category => {
              return (
                  <MegaMenuItem
                      category={category}
                      activeCategoryId={activeCategoryId}
                      mainNavWidth={mainNavWidth}
                      key={category.id}
                  />
              );
          })
        : null;

    return (
        <nav ref={mainNavRef} className={classes.megaMenu} role="navigation">
            {items}
        </nav>
    );
};

export default MegaMenu;

MegaMenu.propTypes = {
    megaMenuData: PropTypes.object,
    activeCategoryId: PropTypes.number
};
