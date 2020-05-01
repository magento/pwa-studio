import { useCallback, useMemo } from 'react';

export const useAddressCard = props => {
    const { address, onEdit, onSelection } = props;
    const { id: addressId } = address;

    const addressForEdit = useMemo(() => {
        const { country_code: countryCode, region, ...addressRest } = address;
        const { region_code: regionCode } = region;

        return {
            ...addressRest,
            country: {
                code: countryCode
            },
            region: {
                code: regionCode
            }
        };
    }, [address]);

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
        onEdit(addressForEdit);
    }, [addressForEdit, onEdit]);

    return {
        handleClick,
        handleEditAddress,
        handleKeyPress
    };
};
