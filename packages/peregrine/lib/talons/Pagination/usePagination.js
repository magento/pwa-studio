import { useCallback, useMemo } from 'react';

export const usePagination = props => {
    const { currentPage, setPage, totalPages, tileBuffer = 2 } = props;

    const getLeadTile = useCallback(
        (currentPage, totalPages) => {
            const selectedTile = currentPage;
            const leftBound = 1 + tileBuffer;
            const rightBound = totalPages - tileBuffer;

            let leadTile = selectedTile - tileBuffer;
            if (selectedTile < leftBound) {
                leadTile = 1;
            } else if (selectedTile > rightBound) {
                leadTile = Math.max(totalPages - tileBuffer * 2, 1);
            }
            return leadTile;
        },
        [tileBuffer]
    );

    const handleLeftSkip = useCallback(() => {
        const leadTile = getLeadTile(currentPage, totalPages);

        const leftSkip = Math.max(1, leadTile - (tileBuffer + 1));

        setPage(leftSkip);
    }, [currentPage, getLeadTile, setPage, totalPages, tileBuffer]);

    const handleRightSkip = useCallback(() => {
        const leadTile = getLeadTile(currentPage, totalPages);
        const rightSkip = Math.min(
            totalPages,
            leadTile + tileBuffer * 2 + (tileBuffer + 1)
        );

        setPage(rightSkip);
    }, [currentPage, getLeadTile, setPage, totalPages, tileBuffer]);

    const handleNavBack = useCallback(() => {
        if (currentPage > 1) {
            setPage(currentPage - 1);
        }
    }, [currentPage, setPage]);

    const handleNavForward = useCallback(() => {
        if (currentPage < totalPages) {
            setPage(currentPage + 1);
        }
    }, [currentPage, setPage, totalPages]);

    const isActiveLeft = currentPage !== 1;
    const isActiveRight = currentPage !== totalPages;

    const tiles = useMemo(() => {
        const tiles = [];
        const visibleBuffer = Math.min(tileBuffer * 2, totalPages - 1);
        const leadTile = getLeadTile(currentPage, totalPages);

        for (let i = leadTile; i <= leadTile + visibleBuffer; i++) {
            const tile = i;
            tiles.push(tile);
        }
        return tiles;
    }, [currentPage, getLeadTile, totalPages, tileBuffer]);

    return {
        handleLeftSkip,
        handleRightSkip,
        handleNavBack,
        handleNavForward,
        isActiveLeft,
        isActiveRight,
        tiles
    };
};
