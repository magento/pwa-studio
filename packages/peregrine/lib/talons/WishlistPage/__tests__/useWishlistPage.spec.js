import React from 'react';
import { useQuery } from '@apollo/client';

import { createTestInstance } from '@magento/peregrine';
import { useWishlistPage } from '../useWishlistPage';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn()
}));
jest.mock('@apollo/client', () => {
    const ApolloClient = jest.requireActual('@apollo/client');
    return {
        ...ApolloClient,
        useQuery: jest.fn().mockReturnValue({})
    };
});
jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: true }])
}));

const Component = props => {
    const talonProps = useWishlistPage(props);

    return <i talonProps={talonProps} />;
};

const props = {
    queries: {
        getCustomerWishlistQuery: {}
    }
};

test('return correct shape', () => {
    const { root } = createTestInstance(<Component {...props} />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('works without props', () => {
    const { root } = createTestInstance(<Component />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return wishlist data', () => {
    useQuery.mockReturnValueOnce({
        data: { customer: { wishlists: ['wishlist1', 'wishlist2'] } }
    });

    const { root } = createTestInstance(<Component {...props} />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.wishlists).toMatchSnapshot();
});

test('shouldRenderVisibilityToggle is false if 1 or less lists', () => {
    useQuery.mockReturnValueOnce({
        data: { customer: { wishlists: [] } }
    });

    let instance = createTestInstance(<Component {...props} />);
    let talonProps = instance.root.findByType('i').props.talonProps;

    expect(talonProps.shouldRenderVisibilityToggle).toBeFalsy();

    useQuery.mockReturnValueOnce({
        data: { customer: { wishlists: ['wishlist1'] } }
    });

    instance = createTestInstance(<Component {...props} />);
    talonProps = instance.root.findByType('i').props.talonProps;

    expect(talonProps.shouldRenderVisibilityToggle).toBeFalsy();

    useQuery.mockReturnValueOnce({
        data: { customer: { wishlists: ['wishlist1', 'wishlist2'] } }
    });

    instance = createTestInstance(<Component {...props} />);
    talonProps = instance.root.findByType('i').props.talonProps;

    expect(talonProps.shouldRenderVisibilityToggle).toBeTruthy();
});
