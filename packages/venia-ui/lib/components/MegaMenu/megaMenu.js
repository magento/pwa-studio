import React, { useRef, useState, useEffect } from 'react';

import { useMegaMenu } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu';

import { useStyle } from '../../classify';
import defaultClasses from './megaMenu.css';
import MegaMenuItem from './megaMenuItem';

/**
 * The MegaMenu component displays menu with categories on desktop devices
 */
const MegaMenu = props => {
    const { megaMenuData, activeCategoryId } = useMegaMenu();
    const classes = useStyle(defaultClasses, props.classes);

    const mainNavRef = useRef(null);
    const [mainNavWidth, setMainNavWidth] = useState(0);
    const [subMenuState, setSubMenuState] = useState('');

    const useOutsideAlerter = ref => {
        useEffect(() => {
            // Reset menu if clicked outside
            const handleClickOutside = e => {
                if (ref.current && !ref.current.contains(e.target)) {
                    setSubMenuState(false);
                }
            };

            // Bind the event listener to both mouse and key events
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleClickOutside);
            document.addEventListener('mouseout', handleClickOutside);

            return () => {
                // Unbind the event listener to clean up
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleClickOutside);
                document.removeEventListener('mouseout', handleClickOutside);
            };
        }, [ref]);
    };

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
