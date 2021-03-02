import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import { useCheckmo } from '../useCheckmo';

/**
 * Mocks
 */
const getCheckmoConfigQuery = 'getCheckmoConfigQuery';
const setPaymentMethodOnCartMutation = 'setPaymentMethodOnCartMutation';

jest.mock('@apollo/client');

const setPaymentMethodOnCart = jest.fn();
const getCheckmoConfig = jest.fn().mockReturnValue({
    data: {
        storeConfig: {
            payment_checkmo_payable_to: 'Venia Inc. Test',
            payment_checkmo_mailing_address: 'A test address'
        }
    }
});

const setPaymentMethodOnCartMutationResult = jest.fn().mockReturnValue([
    setPaymentMethodOnCart,
    {
        error: null,
        loading: false,
        called: true
    }
]);

beforeAll(() => {
    useQuery.mockImplementation(query => {
        if (query === getCheckmoConfigQuery) {
            return getCheckmoConfig();
        } else {
            return [jest.fn(), {}];
        }
    });

    useMutation.mockImplementation(mutation => {
        if (mutation === setPaymentMethodOnCartMutation) {
            return setPaymentMethodOnCartMutationResult();
        } else {
            return [jest.fn(), {}];
        }
    });
});

jest.mock('@magento/peregrine/lib/context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

const operations = {
    getCheckmoConfigQuery,
    setPaymentMethodOnCartMutation
};

const Component = props => {
    const talonProps = useCheckmo(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

/**
 * Tests
 */
test('Should return correct shape', () => {
    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        operations,
        onPaymentSuccess: () => {},
        onPaymentError: () => {},
        resetShouldSubmit: () => {}
    });

    expect(talonProps).toMatchSnapshot();
});

test('Shuold call resetShouldSubmit when billing can not set', () => {
    const resetShouldSubmit = jest.fn();

    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        operations,
        onPaymentSuccess: () => {},
        onPaymentError: () => {},
        resetShouldSubmit
    });

    talonProps.onBillingAddressChangedError();
    expect(resetShouldSubmit).toHaveBeenCalled();
});

test('Should call onPaymentSuccess if payment was set', () => {
    const onPaymentSuccess = jest.fn();

    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        operations,
        onPaymentSuccess,
        onPaymentError: () => {},
        resetShouldSubmit: () => {}
    });

    talonProps.onBillingAddressChangedSuccess();

    expect(onPaymentSuccess).toHaveBeenCalled();
});

test('Should call onPaymentError if payment was  not set', () => {
    const onPaymentError = jest.fn();

    setPaymentMethodOnCartMutationResult.mockReturnValueOnce([
        () => {},
        {
            error: { graphQLErrors: ['some error'] },
            called: true,
            loading: false
        }
    ]);

    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        operations,
        onPaymentSuccess: () => {},
        onPaymentError,
        resetShouldSubmit: () => {}
    });

    talonProps.onBillingAddressChangedSuccess();

    expect(onPaymentError).toHaveBeenCalled();
});
