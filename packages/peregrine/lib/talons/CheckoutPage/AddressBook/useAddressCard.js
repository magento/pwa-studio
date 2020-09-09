import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

export const useAddressCard = props => {
    const { address, onEdit, onSelection } = props;
    const { id: addressId } = address;

    const [hasUpdate, setHasUpdate] = useState(false);
    const hasRendered = useRef(false);

    useEffect(() => {
        let updateTimer;
        if (address !== undefined) {
            if (hasRendered.current) {
                setHasUpdate(true);
                updateTimer = setTimeout(() => {
                    setHasUpdate(false);
                }, 2000);
            } else {
                hasRendered.current = true;
            }
        }

        return () => {
            if (updateTimer) {
                clearTimeout(updateTimer);
            }
        };
    }, [hasRendered, address]);

    const addressForEdit = useMemo(() => {
        const { country_code: countryCode, ...addressRest } = address;

        return {
            ...addressRest,
            country: {
                code: countryCode
            }
        };
    }, [address]);

    const handleClick = useCallback(() => {
        onSelection(addressId);
    }, [addressId, onSelection]);

    const handleKeyPress = useCallback(
        event => {
            if (event.key === 'Enter') {
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
        handleKeyPress,
        hasUpdate
    };
};
