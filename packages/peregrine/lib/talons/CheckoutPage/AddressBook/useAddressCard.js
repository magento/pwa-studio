import { useCallback } from 'react';

export const useAddressCard = props => {
    const { address, onEdit, onSelection } = props;
    const { id: addressId } = address;

    const handleClick = useCallback(() => {
        onSelection(addressId);
    }, [addressId, onSelection]);

    const handleKeyPress = useCallback(
        e => {
            if (e.key === 'Enter') {
                onSelection(addressId);
            }
        },
        [addressId, onSelection]
    );

    const handleEditAddress = useCallback(() => {
        onEdit(address);
    }, [address, onEdit]);

    return {
        handleClick,
        handleEditAddress,
        handleKeyPress
    };
};
