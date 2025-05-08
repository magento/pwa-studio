/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useEffect } from 'react';

import { useProducts } from '../../context';
import { ELLIPSIS, usePagination } from '../../hooks/usePagination';
import Chevron from '../../icons/chevron.svg';

export const Pagination = ({ onPageChange, totalPages, currentPage }) => {
  const productsCtx = useProducts();
  const paginationRange = usePagination({
    currentPage,
    totalPages,
  });

  useEffect(() => {
    const { currentPage: ctxCurrentPage, totalPages: ctxTotalPages } = productsCtx;
    if (ctxCurrentPage > ctxTotalPages) {
      onPageChange(ctxTotalPages);
    }
  }, []); // Only run on mount

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const onNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <ul className="ds-plp-pagination flex justify-center items-center mt-2 mb-6 list-none">
      <img src={Chevron} className={`h-sm w-sm transform rotate-90 ${
          currentPage === 1
            ? 'stroke-gray-400 cursor-not-allowed'
            : 'stroke-gray-600 cursor-pointer'
        }`}
        onClick={onPrevious}
      /> 
      {/* <Chevron
        className={`h-sm w-sm transform rotate-90 ${
          currentPage === 1
            ? 'stroke-gray-400 cursor-not-allowed'
            : 'stroke-gray-600 cursor-pointer'
        }`}
        onClick={onPrevious}
      /> */}

      {paginationRange?.map((page) => {
        if (page === ELLIPSIS) {
          return (
            <li
              key={`ellipsis-${Math.random()}`}
              className="ds-plp-pagination__dots text-gray-500 mx-sm my-auto"
            >
              ...
            </li>
          );
        }

        return (
          <li
            key={page}
            className={`ds-plp-pagination__item flex items-center cursor-pointer text-center text-gray-500 my-auto mx-sm ${
              currentPage === page
                ? 'ds-plp-pagination__item--current text-black font-medium underline underline-offset-4 decoration-black'
                : ''
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </li>
        );
      })}
      <img src={Chevron} className={`h-sm w-sm transform -rotate-90 ${
          currentPage === totalPages
            ? 'stroke-gray-400 cursor-not-allowed'
            : 'stroke-gray-600 cursor-pointer'
        }`}
        onClick={onNext}
      />
      {/* <Chevron
        className={`h-sm w-sm transform -rotate-90 ${
          currentPage === totalPages
            ? 'stroke-gray-400 cursor-not-allowed'
            : 'stroke-gray-600 cursor-pointer'
        }`}
        onClick={onNext}
      /> */}
    </ul>
  );
};

export default Pagination;
