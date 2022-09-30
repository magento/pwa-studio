import React from 'react';
import { useQuery } from '@apollo/client';

import { usePaymentMethods } from '../usePaymentMethods';

import { useCartContext } from '../../../../context/cart';
import createTestInstance from '../../../../util/createTestInstance';

jest.mock('../../../../context/cart');
useCartContext.mockReturnValue([{ cartId: '123456' }]);

jest.mock(
    '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper',
    () => {
        return jest.fn().mockReturnValue({
            value: 'currentSelectedPaymentMethod'
        });
    }
);

const mockSetPaymentMethodOnCartMutation = jest.fn();

jest.mock('@apollo/client', () => {
    return {
        useMutation: jest.fn(() => [
            mockSetPaymentMethodOnCartMutation,
            { loading: true }
        ]),
        useQuery: jest.fn().mockReturnValue({
            data: {
                cart: {
                    available_payment_methods: [
                        { code: 'availablePaymentMethod' }
                    ],
                    selected_payment_method: { code: 'braintree' }
                }
            },
            loading: false
        })
    };
});

jest.mock('../paymentMethods.gql', () => ({
    getPaymentMethodsQuery: 'paymentMethodsQuery',
    setPaymentMethodOnCartMutation: 'setPaymentMethod'
}));

const getPaymentMethodsQuery = 'getPaymentMethodsQuery';
const setPaymentMethodOnCartMutation = 'setPaymentMethodOnCartMutation';

const operations = {
    getPaymentMethodsQuery,
    setPaymentMethodOnCartMutation
};

const Component = props => {
    const talonProps = usePaymentMethods(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);

    const { talonProps } = tree.root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return tree.root.findByType('i').props;
    };

    return { talonProps, tree, update };
};

it('returns the correct shape', () => {
    const { talonProps } = getTalonProps({
        operations
    });

    expect(talonProps).toMatchSnapshot();
});

it('returns an empty array for availablePaymentMethods when there is no data', () => {
    useQuery.mockReturnValueOnce({ loading: false });

    const { talonProps } = getTalonProps();

    expect(talonProps.availablePaymentMethods).toEqual([]);
    expect(talonProps.initialSelectedMethod).toBeNull();
});
