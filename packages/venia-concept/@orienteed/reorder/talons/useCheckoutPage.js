import { GET_CHECKOUT_DETAILS } from '@magento/peregrine/lib/talons/CheckoutPage/checkoutPage.gql';
import { useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export default original => {
    return function useCheckoutPage(props, ...restArgs) {
        const [{ cartId }] = useCartContext();

        // Run the original, wrapped function
        let { ...defaultReturnData } = original(props, ...restArgs);

        useQuery(GET_CHECKOUT_DETAILS, {
            fetchPolicy: 'network-only',
            variables: {
                cartId
            }
        });

        return {
            ...defaultReturnData
        };
    };
};
