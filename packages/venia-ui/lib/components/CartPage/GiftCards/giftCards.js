import React from 'react';

import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCards';

import GET_CART_DETAILS_QUERY from '../../../queries/getCartDetails.graphql';

const GiftCards = props => {
    const talonProps = useGiftCards({
        cartQuery: GET_CART_DETAILS_QUERY
    });
    const { data, error, loading } = talonProps;

    console.log('data', data);
    console.log('error', error);
    console.log('loading', loading);

    return <span>GIFT CARDS TBD</span>;
};

export default GiftCards;
