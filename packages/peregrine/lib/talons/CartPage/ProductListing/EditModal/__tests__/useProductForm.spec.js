import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation, useQuery } from '@apollo/client';
import createTestInstance from '../../../../../util/createTestInstance';
import {
    cartItem,
    configurableItemResponse
} from '../__fixtures__/configurableProduct';
import { configurableThumbnailSourceResponse } from '../__fixtures__/configurableThumbnailSource';
import { useProductForm } from '../useProductForm';
import { useEventingContext } from '../../../../../context/eventing';
import { getOutOfStockVariantsWithInitialSelection } from '@magento/peregrine/lib/util/getOutOfStockVariantsWithInitialSelection';

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

jest.mock('../productForm.gql', () => ({
    getConfigurableOptionsQuery: 'getConfigurableOptionsQuery',
    updateQuantityMutation: 'updateQuantityMutation',
    updateConfigurableOptionsMutation: 'updateConfigurableOptionsMutation',
    getConfigurableThumbnailSourceQuery: 'getConfigurableThumbnailSourceQuery'
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

jest.mock('../../../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

jest.mock(
    '@magento/peregrine/lib/util/getOutOfStockVariantsWithInitialSelection',
    () => ({
        getOutOfStockVariantsWithInitialSelection: jest.fn().mockReturnValue([])
    })
);

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

const configurableProductWithTwoOptionGroupProps = {
    ...mockProps,
    product: {
        __typename: 'ConfigurableProduct',
        stock_status: 'IN_STOCK',
        configurable_options: [
            {
                attribute_code: 'fashion_color',
                attribute_id: '179',
                id: 1,
                label: 'Fashion Color',
                values: [
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '20',
                        default_label: 'Gold',
                        label: 'Gold',
                        store_label: 'Gold',
                        use_default_value: true,
                        value_index: 14
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '30',
                        default_label: 'Peach',
                        label: 'Peach',
                        store_label: 'Peach',
                        use_default_value: true,
                        value_index: 31
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '40',
                        default_label: 'Mint',
                        label: 'Mint',
                        store_label: 'Mint',
                        use_default_value: true,
                        value_index: 35
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '50',
                        default_label: 'Lily',
                        label: 'Lily',
                        store_label: 'Lily',
                        use_default_value: true,
                        value_index: 36
                    }
                ]
            },
            {
                attribute_code: 'fashion_size',
                attribute_id: '190',
                id: 2,
                label: 'Fashion Size',
                values: [
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '60',
                        default_label: 'L',
                        label: 'L',
                        store_label: 'L',
                        use_default_value: true,
                        value_index: 43
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '70',
                        default_label: 'M',
                        label: 'M',
                        store_label: 'M',
                        use_default_value: true,
                        value_index: 44
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '80',
                        default_label: 'S',
                        label: 'S',
                        store_label: 'S',
                        use_default_value: true,
                        value_index: 45
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '90',
                        default_label: 'XS',
                        label: 'XS',
                        store_label: 'XS',
                        use_default_value: true,
                        value_index: 46
                    }
                ]
            }
        ],
        variants: [
            {
                attributes: [
                    {
                        code: 'fashion_color',
                        value_index: 14,
                        __typename: 'ConfigurableAttributeOption'
                    },
                    {
                        code: 'fashion_size',
                        value_index: 45,
                        __typename: 'ConfigurableAttributeOption'
                    }
                ],
                product: {
                    __typename: 'SimpleProduct',
                    sku: 'configurableProductPropsConfig1',
                    stock_status: 'IN_STOCK',
                    id: 3
                },
                __typename: 'ConfigurableVariant'
            },
            {
                attributes: [
                    {
                        code: 'fashion_color',
                        value_index: 14,
                        __typename: 'ConfigurableAttributeOption'
                    },
                    {
                        code: 'fashion_size',
                        value_index: 46,
                        __typename: 'ConfigurableAttributeOption'
                    }
                ],
                product: {
                    __typename: 'SimpleProduct',
                    sku: 'configurableProductPropsConfig2',
                    stock_status: 'OUT_OF_STOCK',
                    id: 4
                },
                __typename: 'ConfigurableVariant'
            },
            {
                attributes: [
                    {
                        code: 'fashion_color',
                        value_index: 14,
                        __typename: 'ConfigurableAttributeOption'
                    },
                    {
                        code: 'fashion_size',
                        value_index: 44,
                        __typename: 'ConfigurableAttributeOption'
                    }
                ],
                product: {
                    __typename: 'SimpleProduct',
                    sku: 'configurableProductPropsConfig3',
                    stock_status: 'OUT_OF_STOCK',
                    id: 5
                },
                __typename: 'ConfigurableVariant'
            },
            {
                attributes: [
                    {
                        code: 'fashion_color',
                        value_index: 31,
                        __typename: 'ConfigurableAttributeOption'
                    },
                    {
                        code: 'fashion_size',
                        value_index: 43,
                        __typename: 'ConfigurableAttributeOption'
                    }
                ],
                product: {
                    __typename: 'SimpleProduct',
                    sku: 'configurableProductPropsConfig4',
                    stock_status: 'OUT_OF_STOCK',
                    id: 6
                },
                __typename: 'ConfigurableVariant'
            },
            {
                attributes: [
                    {
                        code: 'fashion_color',
                        value_index: 35,
                        __typename: 'ConfigurableAttributeOption'
                    },
                    {
                        code: 'fashion_size',
                        value_index: 44,
                        __typename: 'ConfigurableAttributeOption'
                    }
                ],
                product: {
                    __typename: 'SimpleProduct',
                    sku: 'configurableProductPropsConfig5',
                    stock_status: 'OUT_OF_STOCK',
                    id: 7
                },
                __typename: 'ConfigurableVariant'
            }
        ]
    }
};

const configurableOptionCodes = new Map();
configurableOptionCodes.set('179', 'fashion_color');
configurableOptionCodes.set('190', 'fashion_size');
const multipleOptionSelections = new Map();
multipleOptionSelections.set('179', 14);
multipleOptionSelections.set('190', 43);
const isOutOfStockProductDisplayed = true;

test('returns correct shape with fetched options', () => {
    useQuery
        .mockReturnValueOnce(configurableItemResponse)
        .mockReturnValueOnce(configurableThumbnailSourceResponse);
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
        useQuery
            .mockReturnValueOnce(configurableItemResponse)
            .mockReturnValueOnce(configurableThumbnailSourceResponse);
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

    test('should dispatch event when only quantity changes', async () => {
        const mockDispatch = jest.fn();

        useEventingContext.mockReturnValue([
            {},
            {
                dispatch: mockDispatch
            }
        ]);

        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;
        const { handleSubmit } = talonProps;

        await handleSubmit({ quantity: 10 });

        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
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

    test('should dispatch event when options changes', async () => {
        // since this test renders twice, we need to double up the mocked returns
        setupMockedReturns();

        const mockDispatch = jest.fn();

        useEventingContext.mockReturnValue([
            {},
            {
                dispatch: mockDispatch
            }
        ]);

        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;
        const { handleOptionSelection } = talonProps;

        handleOptionSelection('123', 2);

        const { talonProps: newTalonProps } = root.findByType('i').props;
        const { handleSubmit } = newTalonProps;

        await handleSubmit({ quantity: 5 });

        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
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

describe('with configurable product options', () => {
    test('calls getOutOfStockVariantsWithInitialSelection() with initial selections', () => {
        getOutOfStockVariantsWithInitialSelection(
            configurableProductWithTwoOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelections,
            configurableProductWithTwoOptionGroupProps,
            isOutOfStockProductDisplayed
        );

        expect(getOutOfStockVariantsWithInitialSelection).toHaveBeenCalledTimes(
            1
        );

        expect(getOutOfStockVariantsWithInitialSelection.mock.calls[0][2])
            .toMatchInlineSnapshot(`
            Map {
              "179" => 14,
              "190" => 43,
            }
        `);
    });
    test('calls getOutOfStockVariants() with the correct selection values when selection changes', () => {
        getOutOfStockVariantsWithInitialSelection(
            configurableProductWithTwoOptionGroupProps,
            configurableOptionCodes,
            multipleOptionSelections,
            configurableProductWithTwoOptionGroupProps,
            isOutOfStockProductDisplayed
        );

        // Select a new fashion color
        multipleOptionSelections.set('179', 35);

        expect(getOutOfStockVariantsWithInitialSelection).toHaveBeenCalledTimes(
            1
        );
        //multipleOptionSelections
        expect(getOutOfStockVariantsWithInitialSelection.mock.calls[0][2])
            .toMatchInlineSnapshot(`
        Map {
          "179" => 35,
          "190" => 43,
        }
    `);

        // Select a new fashion size
        multipleOptionSelections.set('190', 45);

        expect(getOutOfStockVariantsWithInitialSelection).toHaveBeenCalledTimes(
            1
        );
        //multipleOptionSelections
        expect(getOutOfStockVariantsWithInitialSelection.mock.calls[0][2])
            .toMatchInlineSnapshot(`
        Map {
          "179" => 35,
          "190" => 45,
        }
    `);
    });
});
