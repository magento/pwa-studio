/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useMemo } from 'react';

export const ELLIPSIS = '...';

const getRange = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, index) => start + index);
};

export const usePagination = ({
    currentPage,
    totalPages,
    siblingCount = 1
}) => {
    const paginationRange = useMemo(() => {
        const firstPageIndex = 1;
        const lastPageIndex = totalPages;
        const totalPagePills = siblingCount + 5; // siblingCount + firstPage + lastPage + currentPage + 2 * ellipsis(...)

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPages
        );

        // We do not show the left/right dots(...) if there is just one page left to be inserted between the extremes of sibling and the page limits.
        const showLeftDots = leftSiblingIndex > 2;
        const showRightDots = rightSiblingIndex < totalPages - 2;

        // Case 1 - the total page count is less than the page pills we want to show.

        // < 1 2 3 4 5 6 >
        if (totalPages <= totalPagePills) {
            return getRange(1, totalPages);
        }

        // Case 2 - the total page count is greater than the page pills and only the dots on the right are shown

        // < 1 2 3 4 ... 25 >
        if (!showLeftDots && showRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = getRange(1, leftItemCount);
            return [...leftRange, ELLIPSIS, totalPages];
        }

        // Case 3 - the total page count is greater than the page pills and only the dots on the left are shown

        // < 1 ... 22 23 24 25 >
        if (showLeftDots && !showRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = getRange(
                totalPages - rightItemCount + 1,
                totalPages
            );
            return [firstPageIndex, ELLIPSIS, ...rightRange];
        }

        // Case 4 - the total page count is greater than the page pills and both the right and left dots are shown

        // < 1 ... 19 20 21 ... 25 >
        if (showLeftDots && showRightDots) {
            const middleRange = getRange(leftSiblingIndex, rightSiblingIndex);
            return [
                firstPageIndex,
                ELLIPSIS,
                ...middleRange,
                ELLIPSIS,
                lastPageIndex
            ];
        }
    }, [currentPage, totalPages, siblingCount]);

    return paginationRange;
};
