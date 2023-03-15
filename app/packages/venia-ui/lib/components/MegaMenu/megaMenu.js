import React, { useEffect, useRef, useState } from 'react';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useMegaMenu } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';

import MegaMenuItem from './megaMenuItem';
import defaultClasses from './megaMenu.module.css';

/**
 * The MegaMenu component displays menu with categories on desktop devices
 */
const MegaMenu = props => {
    const mainNavRef = useRef(null);

    const {
        megaMenuData,
        activeCategoryId,
        subMenuState,
        disableFocus,
        handleSubMenuFocus,
        categoryUrlSuffix,
        handleNavigate,
        handleClickOutside
    } = useMegaMenu({ mainNavRef });

    const classes = useStyle(defaultClasses, props.classes);

    const [mainNavWidth, setMainNavWidth] = useState(0);
    const shouldRenderItems = useIsInViewport({
        elementRef: mainNavRef
    });

    const navWidth = mainNavRef.current ? mainNavRef.current.offsetWidth : null;

    useEffect(() => {
        if (navWidth) setMainNavWidth(navWidth);
    }, [navWidth]);

    const items = megaMenuData.children
        ? megaMenuData.children.map(category => {
              return (
                  <MegaMenuItem
                      category={category}
                      activeCategoryId={activeCategoryId}
                      categoryUrlSuffix={categoryUrlSuffix}
                      mainNavWidth={mainNavWidth}
                      onNavigate={handleNavigate}
                      key={category.uid}
                      subMenuState={subMenuState}
                      disableFocus={disableFocus}
                      handleSubMenuFocus={handleSubMenuFocus}
                      handleClickOutside={handleClickOutside}
                  />
              );
          })
        : null;

    return (
        <nav
            ref={mainNavRef}
            className={classes.megaMenu}
            data-cy="MegaMenu-megaMenu"
            role="navigation"
            onFocus={handleSubMenuFocus}
        >
            {shouldRenderItems ? items : null}
        </nav>
    );
};

export default MegaMenu;
