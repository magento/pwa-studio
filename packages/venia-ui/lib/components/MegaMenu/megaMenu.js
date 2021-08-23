import React, { useRef, useState, useEffect } from 'react';

import { useMegaMenu } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu';
import { useSubmenuBlurHandler } from '@magento/peregrine/lib/talons/MegaMenu/useSubmenuBlurHandler';

import { useStyle } from '../../classify';
import defaultClasses from './megaMenu.css';
import MegaMenuItem from './megaMenuItem';

/**
 * The MegaMenu component displays menu with categories on desktop devices
 */
const MegaMenu = props => {
    const [subMenuState, setSubMenuState] = useState(false);
    const {
        megaMenuData,
        activeCategoryId,
    } = useMegaMenu({
        setSubMenuState
    });
    const classes = useStyle(defaultClasses, props.classes);

    const mainNavRef = useRef(null);
    const [mainNavWidth, setMainNavWidth] = useState(0);

    const {
        disableFocus
    } = useSubmenuBlurHandler({
        mainNavRef,
        setSubMenuState
    });

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
                      subMenuState={subMenuState}
                      disableFocus={disableFocus}
                  />
              );
          })
        : null;

    useSubmenuBlurHandler(mainNavRef, setSubMenuState)

    return (
        <nav
            ref={mainNavRef}
            className={classes.megaMenu}
            role="navigation"
            onFocus={() => {
                setSubMenuState(true);
            }}
        >
            {items}
        </nav>
    );
};

export default MegaMenu;
