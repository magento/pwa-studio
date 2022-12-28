import { useCallback } from 'react';

export const useThumbnail = props => {
    const { itemIndex, onClickHandler } = props;

    const handleClick = useCallback(() => {
        onClickHandler(itemIndex);
    }, [onClickHandler, itemIndex]);

    return {
        handleClick
    };
};
