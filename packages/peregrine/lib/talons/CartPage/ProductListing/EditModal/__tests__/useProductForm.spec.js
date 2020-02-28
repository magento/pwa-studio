import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useAppContext } from '../../../../../context/app';
import createTestInstance from '../../../../../util/createTestInstance';
import { useProductForm } from '../useProductForm';

jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest
        .fn()
        .mockReturnValue([jest.fn(), { called: false, loading: false }]),
    useQuery: jest.fn().mockReturnValue({
        data: null,
        error: null,
        loading: true
    })
}));

jest.mock('../../../../../context/app', () => {
    const state = {};
    const api = {
        closeDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);

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

const configItemResponse = {
    data: {
        products: {
            items: [
                {
                    configurable_options: [
                        {
                            attribute_id: '123',
                            attribute_code: 'color'
                        },
                        {
                            attribute_id: '456',
                            attribute_code: 'size'
                        }
                    ],
                    variants: [
                        {
                            attributes: [
                                { code: 'color', value_index: 1 },
                                { code: 'size', value_index: 1 }
                            ],
                            product: {
                                sku: 'SP11'
                            }
                        },
                        {
                            attributes: [
                                { code: 'color', value_index: 1 },
                                { code: 'size', value_index: 2 }
                            ],
                            product: {
                                sku: 'SP12'
                            }
                        },
                        {
                            attributes: [
                                { code: 'color', value_index: 2 },
                                { code: 'size', value_index: 1 }
                            ],
                            product: {
                                sku: 'SP21'
                            }
                        },
                        {
                            attributes: [
                                { code: 'color', value_index: 2 },
                                { code: 'size', value_index: 2 }
                            ],
                            product: {
                                sku: 'SP22'
                            }
                        }
                    ]
                }
            ]
        }
    },
    error: false,
    loading: false
};

const cartItem = {
    configurable_options: [{ id: 123, value_id: 1 }, { id: 456, value_id: 1 }],
    id: 123,
    product: {
        sku: 'SP01'
    },
    quantity: 5
};

test('returns correct shape with fetched options', () => {
    useQuery.mockReturnValueOnce(configItemResponse);
    const tree = createTestInstance(
        <Component cartItem={cartItem} setIsUpdating={jest.fn()} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns loading while fetching options', () => {
    const tree = createTestInstance(
        <Component cartItem={cartItem} setIsUpdating={jest.fn()} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isLoading).toEqual(true);
});

describe('effect calls setIsUpdating', () => {
    test('when simple mutation in flight', () => {
        useMutation.mockReturnValueOnce([
            jest.fn(),
            { called: true, loading: true }
        ]);

        const setIsUpdating = jest.fn();

        createTestInstance(
            <Component cartItem={cartItem} setIsUpdating={setIsUpdating} />
        );

        expect(setIsUpdating).toHaveBeenLastCalledWith(true);
    });

    test('when configurable mutation in flight', () => {
        useMutation
            .mockReturnValueOnce([jest.fn(), { called: false, loading: false }])
            .mockReturnValueOnce([jest.fn(), { called: true, loading: true }]);

        const setIsUpdating = jest.fn();

        createTestInstance(
            <Component cartItem={cartItem} setIsUpdating={setIsUpdating} />
        );

        expect(setIsUpdating).toHaveBeenLastCalledWith(true);
    });
});

test('sync quantity state using form api', () => {
    const tree = createTestInstance(
        <Component cartItem={cartItem} setIsUpdating={jest.fn()} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { setFormApi } = talonProps;
    const formApi = {
        setValue: jest.fn()
    };

    act(() => {
        setFormApi(formApi);
    });

    expect(formApi.setValue).toHaveBeenLastCalledWith('quantity', 5);

    const newQuantityCartItem = {
        ...cartItem,
        quantity: 10
    };

    act(() => {
        tree.update(
            <Component
                cartItem={newQuantityCartItem}
                setIsUpdating={jest.fn()}
            />
        );
    });

    expect(formApi.setValue).toHaveBeenLastCalledWith('quantity', 10);
});

describe('form submission', () => {
    const updateItemQuantity = jest.fn();
    const updateConfigurableOptions = jest.fn();
    const closeDrawer = jest.fn();
    const setupMockedReturns = () => {
        useAppContext.mockReturnValueOnce([{}, { closeDrawer }]);
        useQuery.mockReturnValueOnce(configItemResponse);
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
        closeDrawer.mockClear();
    });

    test('does nothing if values do not change', () => {
        const tree = createTestInstance(
            <Component cartItem={cartItem} setIsUpdating={jest.fn()} />
        );
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;
        const { handleSubmit } = talonProps;

        act(() => {
            handleSubmit({ quantity: 5 });
        });

        expect(updateItemQuantity).not.toHaveBeenCalled();
        expect(updateConfigurableOptions).not.toHaveBeenCalled();
        expect(closeDrawer).toHaveBeenCalledTimes(1);
    });

    test('calls update quantity mutation when only quantity changes', () => {
        const tree = createTestInstance(
            <Component cartItem={cartItem} setIsUpdating={jest.fn()} />
        );
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;
        const { handleSubmit } = talonProps;

        act(() => {
            handleSubmit({ quantity: 10 });
        });

        expect(updateItemQuantity.mock.calls[0][0]).toMatchSnapshot();
        expect(updateConfigurableOptions).not.toHaveBeenCalled();
        expect(closeDrawer).toHaveBeenCalledTimes(1);
    });

    test('calls configurable item mutation when options change', () => {
        // since this test renders twice, we need to double up the mocked returns
        setupMockedReturns();
        const tree = createTestInstance(
            <Component cartItem={cartItem} setIsUpdating={jest.fn()} />
        );
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;
        const { handleOptionSelection } = talonProps;

        act(() => {
            handleOptionSelection('123', 2);
        });

        const { talonProps: newTalonProps } = root.findByType('i').props;
        const { handleSubmit } = newTalonProps;

        act(() => {
            handleSubmit({ quantity: 5 });
        });

        expect(updateItemQuantity).not.toHaveBeenCalled();
        expect(updateConfigurableOptions.mock.calls[0][0]).toMatchSnapshot();
        expect(closeDrawer).toHaveBeenCalledTimes(1);
    });
});
