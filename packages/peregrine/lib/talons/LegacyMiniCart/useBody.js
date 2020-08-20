import { useCallback, useState } from 'react';

export const useBody = props => {
    const { beginEditItem, endEditItem } = props;

    const [editItem, setEditItem] = useState(null);
    const handleBeginEditItem = useCallback(
        item => {
            beginEditItem();
            setEditItem(item);
        },
        [beginEditItem]
    );
    const handleEndEditItem = useCallback(() => {
        endEditItem();
        setEditItem(null);
    }, [endEditItem]);

    return {
        editItem,
        handleBeginEditItem,
        handleEndEditItem
    };
};
