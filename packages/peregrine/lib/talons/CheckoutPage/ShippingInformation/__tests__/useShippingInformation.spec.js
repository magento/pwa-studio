import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useAppContext } from '../../../../context/app';
import { useCartContext } from '../../../../context/cart';
import createTestInstance from '../../../../util/createTestInstance';

import { useShippingInformation } from '../useShippingInformation';

jest.mock('@apollo/react-hooks', () => ({
    useLazyQuery: jest.fn().mockReturnValue([
        jest.fn(),
        {
            called: false,
            data: null,
            error: null,
            loading: false
        }
    ])
}));

jest.mock('../../../../context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const Component = props => {
    const talonProps = useShippingInformation(props);
    return <i talonProps={talonProps} />;
};

test('return correct shape without cart id', () => {
    const tree = createTestInstance(
        <Component onSave={jest.fn()} queries={{}} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape with no data filled in', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            called: true,
            data: {
                cart: {
                    email: null,
                    shipping_addresses: []
                }
            },
            error: null,
            loading: false
        }
    ]);

    const tree = createTestInstance(
        <Component onSave={jest.fn()} queries={{}} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape with mock data from estimate', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            called: true,
            data: {
                cart: {
                    email: null,
                    shipping_addresses: [
                        {
                            city: 'city',
                            country: 'USA',
                            firstname: 'firstname',
                            lastname: 'lastname',
                            postcode: '10019',
                            region: 'New York',
                            street: ['street'],
                            telephone: 'telephone'
                        }
                    ]
                }
            },
            error: null,
            loading: false
        }
    ]);

    const tree = createTestInstance(
        <Component onSave={jest.fn()} queries={{}} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape with real data', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            called: true,
            data: {
                cart: {
                    email: null,
                    shipping_addresses: [
                        {
                            city: 'Manhattan',
                            country: 'USA',
                            email: 'fry@planet.express',
                            firstname: 'Philip',
                            lastname: 'Fry',
                            postcode: '10019',
                            region: 'New York',
                            street: ['3000 57th Street', 'Suite 200'],
                            telephone: '(123) 456-7890'
                        }
                    ]
                }
            },
            error: null,
            loading: false
        }
    ]);

    const tree = createTestInstance(
        <Component onSave={jest.fn()} queries={{}} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('edit handler calls toggle drawer', () => {
    const [, { toggleDrawer }] = useAppContext();
    useCartContext.mockReturnValueOnce([{}]);

    const tree = createTestInstance(
        <Component onSave={jest.fn()} queries={{}} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleEditShipping } = talonProps;

    handleEditShipping();

    expect(toggleDrawer).toHaveBeenCalled();
});
