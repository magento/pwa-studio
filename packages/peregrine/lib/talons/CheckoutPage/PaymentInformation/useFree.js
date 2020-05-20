import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useFree = props => {
    const { onSuccess, shouldSubmit, mutations } = props;
    const { setSelectedPaymentMethodFreeMutation } = mutations;

    const [{ cartId }] = useCartContext();

    const [setFreeSelectedPaymentMethod] = useMutation(
        setSelectedPaymentMethodFreeMutation
    );

    useEffect(() => {
        if (shouldSubmit) {
            setFreeSelectedPaymentMethod({ variables: { cartId } });
            onSuccess();
        }
    }, [onSuccess, shouldSubmit, setFreeSelectedPaymentMethod, cartId]);
};
