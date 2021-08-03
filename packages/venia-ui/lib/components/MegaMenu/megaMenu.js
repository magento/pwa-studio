import React, { useRef, useState, useEffect } from 'react';

import { useMegaMenu } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu';

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
        useOutsideAlerter,
        disableFocus
    } = useMegaMenu({
        setSubMenuState
    });
    const classes = useStyle(defaultClasses, props.classes);

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
        ? megaMenuData.children.map((category, index) => {
              return (
                  <MegaMenuItem
                      subMenuState={subMenuState}
                      category={category}
                      activeCategoryId={activeCategoryId}
                      mainNavWidth={mainNavWidth}
                      key={category.id}
                      disableFocus={disableFocus}
                  />
              );
          })
        : null;

    useOutsideAlerter(mainNavRef); // create bindings for closing menu from outside events

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
