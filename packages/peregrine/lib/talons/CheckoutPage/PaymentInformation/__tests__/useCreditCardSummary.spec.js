import React from 'react';

import { useCreditCardSummary } from '../useCreditCardSummary';
import createTestInstance from '../../../../util/createTestInstance';

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest
        .fn()
        .mockReturnValueOnce({
            data: {
                cart: {
                    billingAddress: {
                        firstName: 'Goosey',
                        lastName: 'Goose',
                        country: { code: 'United States of Gooseland' },
                        street: ['12345 Gooseey Blvd', 'Apt 123'],
                        city: { code: 'Goostin' },
                        region: 'Gooseyork',
                        postalCode: '12345',
                        phoneNumber: '1234567890'
                    }
                }
            }
        })
        .mockReturnValueOnce({
            data: {
                cart: {
                    isBillingAddressSame: false
                }
            }
        })
        .mockReturnValueOnce({ data: { cart: { paymentNonce: '*****' } } })
        .mockReturnValue()
}));

const Component = props => {
    const talonProps = useCreditCardSummary(props);

    return <i talonProps={talonProps} />;
};

test('Should return correct shape', () => {
    const tree = createTestInstance(<Component queries={{}} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});
