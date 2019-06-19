import { useMemo } from 'react';

export const useSortedImages = images => {
    const sortImages = () =>
        images.filter(i => !i.disabled).sort((a, b) => a.position - b.position);
    return useMemo(sortImages, [images]);
};
