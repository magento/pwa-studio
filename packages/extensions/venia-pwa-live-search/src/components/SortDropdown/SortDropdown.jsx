/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../context/translation';
import { useAccessibleDropdown } from '../../hooks/useAccessibleDropdown';
import Chevron from '../../icons/chevron.svg';
import SortIcon from '../../icons/sort.svg';

export const SortDropdown = ({ value, sortOptions, onChange }) => {
  const sortOptionButton = useRef(null);
  const sortOptionMenu = useRef(null);

  const selectedOption = sortOptions.find(e => e.value === value);

  const translation = useTranslation();
  const sortOptionTranslation = translation.SortDropdown.option;
  const sortOption = sortOptionTranslation.replace(
    '{selectedOption}',
    `${selectedOption?.label}`
  );

  const {
    isDropdownOpen,
    setIsDropdownOpen,
    activeIndex,
    setActiveIndex,
    select,
    setIsFocus,
    listRef
  } = useAccessibleDropdown({
    options: sortOptions,
    value,
    onChange
  });

  useEffect(() => {
    const menuRef = sortOptionMenu.current;

    const handleBlur = () => {
      setIsFocus(false);
      setIsDropdownOpen(false);
    };

    const handleFocus = () => {
      if (menuRef?.parentElement?.querySelector(':hover') !== menuRef) {
        setIsFocus(false);
        setIsDropdownOpen(false);
      }
    };

    menuRef?.addEventListener('blur', handleBlur);
    menuRef?.addEventListener('focusin', handleFocus);
    menuRef?.addEventListener('focusout', handleFocus);

    return () => {
      menuRef?.removeEventListener('blur', handleBlur);
      menuRef?.removeEventListener('focusin', handleFocus);
      menuRef?.removeEventListener('focusout', handleFocus);
    };
  }, [sortOptionMenu]);

  return (
    <div
      ref={sortOptionMenu}
      className="ds-sdk-sort-dropdown relative inline-block text-left bg-gray-100 rounded-md outline outline-1 outline-gray-200 hover:outline-gray-600 h-[32px] z-99"
    >
      <button
        className="group flex justify-center items-center font-normal text-sm text-gray-700 rounded-md hover:cursor-pointer border-none bg-transparent hover:border-none hover:bg-transparent focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none h-full w-full px-sm"
        ref={sortOptionButton}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onFocus={() => setIsFocus(false)}
        onBlur={() => setIsFocus(false)}
      >
        <img src={SortIcon} className="h-md w-md mr-sm stroke-gray-600 m-auto" height="32px" width="32px" />
        {/* <SortIcon className="h-md w-md mr-sm stroke-gray-600 m-auto" /> */}
        {selectedOption ? sortOption : translation.SortDropdown.title}
        <img src={Chevron} className={`flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-gray-600 ${
            isDropdownOpen ? '' : 'rotate-180'
          }`} height="32px" width="32px" />
        {/* <Chevron
          className={`flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-gray-600 ${
            isDropdownOpen ? '' : 'rotate-180'
          }`}
        /> */}
      </button>
      {isDropdownOpen && (
        <ul
          ref={listRef}
          tabIndex={-1}
          className="ds-sdk-sort-dropdown__items origin-top-right absolute hover:cursor-pointer right-0 w-full rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none mt-2 z-20"
        >
          {sortOptions.map((option, i) => (
            <li
              key={i}
              aria-selected={option.value === selectedOption?.value}
              onMouseOver={() => setActiveIndex(i)}
              className={`py-xs hover:bg-gray-100 hover:text-gray-900 ${
                i === activeIndex ? 'bg-gray-100 text-gray-900' : ''
              }`}
            >
              <a
                className={`ds-sdk-sort-dropdown__items--item block-display px-md py-sm text-sm mb-0
                no-underline active:no-underline focus:no-underline hover:no-underline
                hover:text-gray-900 ${
                  option.value === selectedOption?.value
                    ? 'ds-sdk-sort-dropdown__items--item-selected font-semibold text-gray-900'
                    : 'font-normal text-gray-800'
                }`}
                onClick={() => select(option.value)}
              >
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
