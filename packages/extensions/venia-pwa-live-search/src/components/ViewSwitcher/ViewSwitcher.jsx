/*
Copyright 2024 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import { useProducts } from '../../context';
import { handleViewType } from '../../utils/handleUrlFilters';

import GridView from '../../icons/gridView.svg';
import ListView from '../../icons/listView.svg';

const ViewSwitcher = () => {
  const { viewType, setViewType } = useProducts();

  const handleClick = (newViewType) => {
    handleViewType(newViewType);
    setViewType(newViewType);
  };

  return (
    <div className="flex justify-between">
      <button
        className={`flex items-center ${
          viewType === 'gridview' ? 'bg-gray-100' : ''
        } ring-black ring-opacity-5 p-sm text-sm h-[32px] border border-gray-300`}
        onClick={() => handleClick('gridview')}
      >
        <GridView className="h-[20px] w-[20px]" />
      </button>
      <button
        className={`flex items-center ${
          viewType === 'listview' ? 'bg-gray-100' : ''
        } ring-black ring-opacity-5 p-sm text-sm h-[32px] border border-gray-300`}
        onClick={() => handleClick('listview')}
      >
        <ListView className="h-[20px] w-[20px]" />
      </button>
    </div>
  );
};

export default ViewSwitcher;
