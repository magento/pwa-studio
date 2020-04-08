import React from 'react';

import { useSummary } from '../useSummary';
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
                        country: 'United States of Gooseland',
                        street1: '12345 Gooseey Blvd',
                        street2: 'Apt 123',
                        city: 'Goostin',
                        state: 'Gooseyork',
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
        .mockReturnValue()
}));

const Component = props => {
    const talonProps = useSummary(props);

    return <i talonProps={talonProps} />;
};

test('Should return correct shape', () => {
    const tree = createTestInstance(<Component queries={{}} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});
