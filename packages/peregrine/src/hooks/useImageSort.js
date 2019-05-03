import { useCallback } from 'react';

export const useImageSort = () => {
    const sortAndFilterImages = useCallback(items =>
        items
            .filter(i => !i.disabled)
            .sort((a, b) => {
                const aPos = isNaN(a.position) ? 9999 : a.position;
                const bPos = isNaN(b.position) ? 9999 : b.position;
                return aPos - bPos;
            })
    );

    return { sortAndFilterImages };
};
