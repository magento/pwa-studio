import React from 'react';

import { flatten, useOrderConfirmationPage } from '../useOrderConfirmationPage';
import createTestInstance from '../../../../../lib/util/createTestInstance';

import { useUserContext } from '../../../../context/user';

jest.mock('../../../../context/user');
useUserContext.mockImplementation(() => {
    return [
        {
            isSignedIn: true
        }
    ];
});

const Component = props => {
    const talonProps = useOrderConfirmationPage(props);

    return <i talonProps={talonProps} />;
};

const mockData = {
    cart: {
        email: 'email',
        shipping_addresses: [
            {
                selected_shipping_method: {
                    carrier_title: 'carrier',
                    method_title: 'method'
                },
                city: 'city',
                country: {
                    label: 'country'
                },
                firstname: 'firstname',
                lastname: 'lastname',
                postcode: 'postcode',
                region: {
                    label: 'region'
                },
                shippingMethod: 'carrier - method',
                street: ['street']
            }
        ],
        total_quantity: 1
    }
};
const DEFAULT_PROPS = {
    data: mockData
};

describe('#flatten', () => {
    it('returns flat cart data', () => {
        const expected = {
            city: 'city',
            country: 'country',
            email: 'email',
            firstname: 'firstname',
            lastname: 'lastname',
            postcode: 'postcode',
            region: 'region',
            shippingMethod: 'carrier - method',
            street: ['street'],
            totalItemQuantity: 1
        };
        expect(flatten(mockData)).toEqual(expected);
    });
});

it('returns the correct shape', () => {
    const tree = createTestInstance(<Component {...DEFAULT_PROPS} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});
