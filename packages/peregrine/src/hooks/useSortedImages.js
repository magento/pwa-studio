import { useMemo } from 'react';

export const useSortedImages = images => {
    const sortImages = () =>
        images
            .filter(i => !i.disabled)
            .sort((a, b) => {
                const aPos = isNaN(a.position) ? 9999 : a.position;
                const bPos = isNaN(b.position) ? 9999 : b.position;
                return aPos - bPos;
            });
    return useMemo(sortImages, [images]);
};
