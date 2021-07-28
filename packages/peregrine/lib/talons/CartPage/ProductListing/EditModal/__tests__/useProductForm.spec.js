import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation, useQuery } from '@apollo/client';
import createTestInstance from '../../../../../util/createTestInstance';
import {
    cartItem,
    configurableItemResponse
} from '../__fixtures__/configurableProduct';
import { useProductForm } from '../useProductForm';

jest.mock('@apollo/client', () => ({
    useMutation: jest
        .fn()
        .mockReturnValue([
            jest.fn(),
            { called: false, error: null, loading: false }
        ]),
    useQuery: jest.fn().mockReturnValue({
        data: null,
        error: null,
        loading: true
    })
}));

jest.mock('../../../../../context/app', () => {
    const state = {};
    const useAppContext = jest.fn(() => [state]);

    return { useAppContext };
});

jest.mock('../../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const Component = props => {
    const talonProps = useProductForm(props);
    return <i talonProps={talonProps} />;
};

const mockProps = {
    cartItem,
    setIsCartUpdating: jest.fn(),
    setVariantPrice: jest.fn(),
    setActiveEditItem: jest.fn()
};

test('returns correct shape with fetched options', () => {
    useQuery.mockReturnValueOnce(configurableItemResponse);
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns loading while fetching options', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isLoading).toEqual(true);
});

test('returns error from quantity mutation', () => {
    const errorResult = new Error();
    useMutation.mockReturnValueOnce([jest.fn(), { error: errorResult }]);
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errors.get('updateQuantityMutation')).toEqual(
        errorResult
    );
});

test('returns error from configurable option mutation', () => {
    const errorResult = new Error();
    useMutation
        .mockReturnValueOnce([jest.fn(), { error: null }])
        .mockReturnValueOnce([jest.fn(), { error: errorResult }]);
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errors.get('updateConfigurableOptionsMutation')).toEqual(
        errorResult
    );
});

describe('effect calls setIsCartUpdating', () => {
    test('when simple mutation in flight', () => {
        useMutation.mockReturnValueOnce([
            jest.fn(),
            { called: true, loading: true }
        ]);

        const setIsCartUpdating = jest.fn();

        createTestInstance(
            <Component {...mockProps} setIsCartUpdating={setIsCartUpdating} />
        );

        expect(setIsCartUpdating).toHaveBeenLastCalledWith(true);
    });

    test('when configurable mutation in flight', () => {
        useMutation
            .mockReturnValueOnce([jest.fn(), { called: false, loading: false }])
            .mockReturnValueOnce([jest.fn(), { called: true, loading: true }]);

        const setIsCartUpdating = jest.fn();

        createTestInstance(
            <Component {...mockProps} setIsCartUpdating={setIsCartUpdating} />
        );

        expect(setIsCartUpdating).toHaveBeenLastCalledWith(true);
    });
});

describe('form submission', () => {
    const updateItemQuantity = jest.fn().mockResolvedValue();
    const updateConfigurableOptions = jest.fn().mockResolvedValue();
    const setupMockedReturns = () => {
        useQuery.mockReturnValueOnce(configurableItemResponse);
        useMutation
            .mockReturnValueOnce([
                updateItemQuantity,
                { called: false, loading: false }
            ])
            .mockReturnValueOnce([
                updateConfigurableOptions,
                { called: false, loading: false }
            ]);
    };

    beforeEach(() => {
        setupMockedReturns();
    });

    afterEach(() => {
        updateItemQuantity.mockClear();
        updateConfigurableOptions.mockClear();
    });

    test('does nothing if values do not change', () => {
        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;
        const { handleSubmit } = talonProps;

        act(() => {
            handleSubmit({ quantity: 5 });
        });

        expect(updateItemQuantity).not.toHaveBeenCalled();
        expect(updateConfigurableOptions).not.toHaveBeenCalled();
    });

    test('calls update quantity mutation when only quantity changes', async () => {
        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;
        const { handleSubmit } = talonProps;

        await act(async () => {
            await handleSubmit({ quantity: 10 });
        });

        expect(updateItemQuantity.mock.calls[0][0]).toMatchSnapshot();
        expect(updateConfigurableOptions).not.toHaveBeenCalled();
    });

    test('calls configurable item mutation when options change', async () => {
        // since this test renders twice, we need to double up the mocked returns

        setupMockedReturns();
        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;
        const { handleOptionSelection } = talonProps;

        act(() => {
            handleOptionSelection('123', 2);
        });

        const { talonProps: newTalonProps } = root.findByType('i').props;
        const { handleSubmit } = newTalonProps;

        await act(async () => {
            await handleSubmit({ quantity: 5 });
        });

        expect(updateItemQuantity).not.toHaveBeenCalled();
        expect(updateConfigurableOptions.mock.calls[0][0]).toMatchSnapshot();
    });

    test('does not call configurable item mutation when final options selection matches backend value', async () => {
        // since this test renders thrice, we need to triple up the mocked returns
        setupMockedReturns();
        setupMockedReturns();
        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        let { talonProps } = root.findByType('i').props;

        act(() => {
            talonProps.handleOptionSelection('123', 2);
        });

        talonProps = root.findByType('i').props.talonProps;

        act(() => {
            talonProps.handleOptionSelection('123', 1);
        });

        talonProps = root.findByType('i').props.talonProps;

        await act(async () => {
            await talonProps.handleSubmit({ quantity: 5 });
        });

        expect(updateItemQuantity).not.toHaveBeenCalled();
        expect(updateConfigurableOptions).not.toHaveBeenCalled();
    });
});

test('does not clear activeEditItem on error', async () => {
    const updateItemQuantity = jest.fn().mockRejectedValue('Apollo Error');
    const setActiveEditItem = jest.fn();

    useMutation.mockReturnValueOnce([updateItemQuantity, {}]);

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await act(async () => {
        await handleSubmit({ quantity: 10 });
    });

    expect(updateItemQuantity).toHaveBeenCalled();
    expect(setActiveEditItem).not.toHaveBeenCalledWith(null);
});
