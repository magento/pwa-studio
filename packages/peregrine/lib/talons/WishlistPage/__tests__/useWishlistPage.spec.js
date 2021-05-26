import React from 'react';
import { useHistory } from 'react-router-dom';

import createTestInstance from '../../../util/createTestInstance';
import { useUserContext } from '../../../context/user';
import { useWishlistPage } from '../useWishlistPage';
import { useQuery } from '@apollo/client';

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
jest.mock('../../../context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: true }])
}));
jest.mock('../../../hooks/useTypePolicies', () => ({
    useTypePolicies: jest.fn()
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

test('unauth redirect to home', () => {
    const mockHistoryPush = jest.fn();
    useHistory.mockReturnValue({ push: mockHistoryPush });
    useUserContext.mockReturnValue([{ isSignedIn: false }]);

    createTestInstance(<Component {...props} />);

    expect(mockHistoryPush).toHaveBeenCalled();
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
