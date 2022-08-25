import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation, useQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useProductFullDetail } from '../useProductFullDetail';
import { useUserContext } from '../../../context/user';
import { useEventingContext } from '../../../context/eventing';

import { getOutOfStockVariants } from '@magento/peregrine/lib/util/getOutOfStockVariants';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ]),
    useQuery: jest.fn().mockImplementation(() => ({
        data: {
            storeConfig: {
                magento_wishlist_general_is_enabled: true
            }
        },
        loading: false,
        error: false
    }))
}));

jest.mock('@magento/peregrine/lib/context/user', () => {
    const userState = { isSignedIn: false };
    const userApi = {};
    const useUserContext = jest.fn(() => [userState, userApi]);

    return { useUserContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const cartState = { cartId: 'ThisIsMyCart' };
    const cartApi = {};
    const useCartContext = jest.fn(() => [cartState, cartApi]);

    return { useCartContext };
});

jest.mock('../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

jest.mock('@magento/peregrine/lib/util/getOutOfStockVariants', () => ({
    getOutOfStockVariants: jest.fn().mockReturnValue([])
}));

const Component = props => {
    const talonProps = useProductFullDetail(props);
    return <i talonProps={talonProps} />;
};

const defaultProps = {
    addConfigurableProductToCartMutation:
        'addConfigurableProductToCartMutation',
    addSimpleProductToCartMutation: 'addSimpleProductToCartMutation',
    product: {
        __typename: 'SimpleProduct',
        price: {
            regularPrice: {
                amount: {
                    value: 99,
                    currency: 'USD'
                }
            }
        },
        price_range: {
            maximum_price: {
                final_price: {
                    value: 99,
                    currency: 'USD'
                },
                discount: {
                    amount_off: 10
                }
            }
        },
        sku: 'MySimpleProductSku',
        stock_status: 'IN_STOCK',
        name: 'Strive Shoulder Pac',
        uid: 'NDA='
    }
};

const outOfStockProductProps = {
    ...defaultProps,
    product: {
        ...defaultProps.product,
        stock_status: 'OUT_OF_STOCK'
    }
};

const configurableProductProps = {
    ...defaultProps,
    product: {
        ...defaultProps.product,
        __typename: 'ConfigurableProduct',
        media_gallery_entries: [],
        price: {
            regularPrice: {
                amount: {
                    value: 99
                }
            }
        },
        configurable_options: [
            {
                attribute_code: 'config',
                attribute_id: '1',
                id: 1,
                label: 'config',
                values: [
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '20',
                        default_label: 'config1',
                        label: 'config1',
                        store_label: 'config1',
                        use_default_value: true,
                        value_index: 2,
                        swatch_data: null,
                        media_gallery_entries: []
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '30',
                        default_label: 'config2',
                        label: 'config2',
                        store_label: 'config2',
                        use_default_value: true,
                        value_index: 3,
                        swatch_data: null,
                        media_gallery_entries: []
                    }
                ]
            }
        ],
        custom_attributes: [
            {
                entered_attribute_value: {
                    value: 'Custom Label'
                },
                attribute_metadata: {
                    uid: 'attribute-uid-1',
                    code: 'attribute_code_1',
                    label: 'Attribute Label 1',
                    attribute_labels: [
                        {
                            store_code: 'default',
                            label: 'Default Label 1'
                        }
                    ],
                    data_type: 'COMPLEX',
                    is_system: false,
                    entity_type: 'PRODUCT',
                    ui_input: {
                        ui_input_type: 'MULTISELECT',
                        is_html_allowed: true
                    },
                    used_in_components: []
                }
            },
            {
                selected_attribute_options: {
                    attribute_option: [
                        {
                            uid: 'option-uid-1',
                            label: 'Custom Label 1',
                            is_default: true
                        },
                        {
                            uid: 'option-uid-2',
                            label: 'Custom Label 2',
                            is_default: true
                        }
                    ]
                },
                attribute_metadata: {
                    uid: 'attribute-uid-2',
                    code: 'attribute_code_2',
                    label: 'Attribute Label 2',
                    attribute_labels: [
                        {
                            store_code: 'default',
                            label: 'Default Label 2'
                        }
                    ],
                    data_type: 'COMPLEX',
                    is_system: false,
                    entity_type: 'PRODUCT',
                    ui_input: {
                        ui_input_type: 'MULTISELECT',
                        is_html_allowed: true
                    },
                    used_in_components: []
                }
            }
        ],
        variants: [
            {
                attributes: [
                    {
                        code: 'config',
                        value_index: 2,
                        __typename: 'ConfigurableAttributeOption'
                    }
                ],
                product: {
                    __typename: 'SimpleProduct',
                    sku: 'configurableProductPropsConfig1',
                    stock_status: 'IN_STOCK',
                    id: 2,
                    media_gallery_entries: [],
                    price: {
                        regularPrice: {
                            amount: {
                                value: 99
                            }
                        }
                    },
                    custom_attributes: [
                        {
                            entered_attribute_value: {
                                value: 'Custom Label'
                            },
                            attribute_metadata: {
                                uid: 'attribute-uid-3',
                                code: 'attribute_code_3',
                                label: 'Attribute Label 3',
                                attribute_labels: [
                                    {
                                        store_code: 'default',
                                        label: 'Default Label 3'
                                    }
                                ],
                                data_type: 'COMPLEX',
                                is_system: false,
                                entity_type: 'PRODUCT',
                                ui_input: {
                                    ui_input_type: 'MULTISELECT',
                                    is_html_allowed: true
                                },
                                used_in_components: []
                            }
                        }
                    ]
                },
                __typename: 'ConfigurableVariant'
            },
            {
                attributes: [
                    {
                        code: 'config',
                        value_index: 3,
                        __typename: 'ConfigurableAttributeOption'
                    }
                ],
                product: {
                    __typename: 'SimpleProduct',
                    sku: 'configurableProductPropsConfig2',
                    stock_status: 'OUT_OF_STOCK',
                    id: 3,
                    media_gallery_entries: [],
                    price: {
                        regularPrice: {
                            amount: {
                                value: 99
                            }
                        }
                    },
                    custom_attributes: []
                },
                __typename: 'ConfigurableVariant'
            }
        ]
    }
};

const outOfOrderCustomAttributeProductProps = {
    ...defaultProps,
    product: {
        ...defaultProps.product,
        custom_attributes: [
            {
                entered_attribute_value: {
                    value: 'Custom Attribute 3'
                },
                attribute_metadata: {
                    uid: 'attribute-uid-3',
                    code: 'attribute_code_3',
                    label: 'Attribute Label 3',
                    attribute_labels: [
                        {
                            store_code: 'default',
                            label: 'Default Label 3'
                        }
                    ],
                    entity_type: 'PRODUCT',
                    ui_input: {
                        ui_input_type: 'TEXT',
                        is_html_allowed: true
                    },
                    used_in_components: []
                }
            },
            {
                // Leave values un-capitalized as testing it doesn't sort by capitalization.
                entered_attribute_value: {
                    value: 'custom attribute 2'
                },
                attribute_metadata: {
                    uid: 'attribute-uid-2',
                    code: 'attribute_code_2',
                    label: 'attribute label 2',
                    attribute_labels: [
                        {
                            store_code: 'default',
                            label: 'default label 2'
                        }
                    ],
                    entity_type: 'PRODUCT',
                    ui_input: {
                        ui_input_type: 'TEXT',
                        is_html_allowed: true
                    },
                    used_in_components: []
                }
            },
            {
                entered_attribute_value: {
                    value: 'Custom Attribute 1'
                },
                attribute_metadata: {
                    uid: 'attribute-uid-1',
                    code: 'attribute_code_1',
                    label: 'Attribute Label 1',
                    attribute_labels: [
                        {
                            store_code: 'default',
                            label: 'Default Label 1'
                        }
                    ],
                    entity_type: 'PRODUCT',
                    ui_input: {
                        ui_input_type: 'TEXT',
                        is_html_allowed: true
                    },
                    used_in_components: []
                }
            }
        ]
    }
};

const configurableOutOfStockProductProps = {
    ...defaultProps,
    product: {
        ...defaultProps.product,
        stock_status: 'OUT_OF_STOCK'
    }
};

const configurableProductWithTwoOptionGroupProps = {
    ...defaultProps,
    product: {
        ...defaultProps.product,
        __typename: 'ConfigurableProduct',
        stock_status: 'IN_STOCK',
        media_gallery_entries: [],
        price: {
            regularPrice: {
                amount: {
                    value: 60
                }
            }
        },
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
                        value_index: 14,
                        swatch_data: null,
                        media_gallery_entries: []
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '30',
                        default_label: 'Peach',
                        label: 'Peach',
                        store_label: 'Peach',
                        use_default_value: true,
                        value_index: 31,
                        swatch_data: null,
                        media_gallery_entries: []
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '40',
                        default_label: 'Mint',
                        label: 'Mint',
                        store_label: 'Mint',
                        use_default_value: true,
                        value_index: 35,
                        swatch_data: null,
                        media_gallery_entries: []
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '50',
                        default_label: 'Lily',
                        label: 'Lily',
                        store_label: 'Lily',
                        use_default_value: true,
                        value_index: 36,
                        swatch_data: null,
                        media_gallery_entries: []
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
                        value_index: 43,
                        swatch_data: null,
                        media_gallery_entries: []
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '70',
                        default_label: 'M',
                        label: 'M',
                        store_label: 'M',
                        use_default_value: true,
                        value_index: 44,
                        swatch_data: null,
                        media_gallery_entries: []
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '80',
                        default_label: 'S',
                        label: 'S',
                        store_label: 'S',
                        use_default_value: true,
                        value_index: 45,
                        swatch_data: null,
                        media_gallery_entries: []
                    },
                    {
                        __typename: 'ConfigurableProductOptionsValues',
                        uid: '90',
                        default_label: 'XS',
                        label: 'XS',
                        store_label: 'XS',
                        use_default_value: true,
                        value_index: 46,
                        swatch_data: null,
                        media_gallery_entries: []
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
                    id: 3,
                    media_gallery_entries: [],
                    price: {
                        regularPrice: {
                            amount: {
                                value: 60
                            }
                        }
                    },
                    custom_attributes: []
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
                    id: 4,
                    media_gallery_entries: [],
                    price: {
                        regularPrice: {
                            amount: {
                                value: 60
                            }
                        }
                    },
                    custom_attributes: []
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
                    id: 5,
                    media_gallery_entries: [],
                    price: {
                        regularPrice: {
                            amount: {
                                value: 60
                            }
                        }
                    },
                    custom_attributes: []
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
                    id: 6,
                    media_gallery_entries: [],
                    price: {
                        regularPrice: {
                            amount: {
                                value: 60
                            }
                        }
                    },
                    custom_attributes: []
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
                    id: 7,
                    media_gallery_entries: [],
                    price: {
                        regularPrice: {
                            amount: {
                                value: 60
                            }
                        }
                    },
                    custom_attributes: []
                },
                __typename: 'ConfigurableVariant'
            }
        ]
    }
};

describe('shouldShowSimpleProductOutOfStockButton', () => {
    test('is false if product is in stock', () => {
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.isOutOfStock).toBeFalsy();
        expect(talonProps.isAddToCartDisabled).toBeFalsy();
    });

    test('is true if product is out of stock', () => {
        const tree = createTestInstance(
            <Component {...outOfStockProductProps} />
        );

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.isOutOfStock).toBeTruthy();
        expect(talonProps.isAddToCartDisabled).toBeTruthy();
    });
});

describe('shouldShowConfigurableProductOutOfStockButton', () => {
    test('is false if product is in stock and no option is selected but disabled', () => {
        const tree = createTestInstance(
            <Component {...configurableProductProps} />
        );

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.isOutOfStock).toBeFalsy();
        expect(talonProps.isAddToCartDisabled).toBeTruthy();
    });

    test('is true if product is out of stock and no option is selected and disabled', () => {
        const tree = createTestInstance(
            <Component {...configurableOutOfStockProductProps} />
        );

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.isOutOfStock).toBeTruthy();
        expect(talonProps.isAddToCartDisabled).toBeTruthy();
    });

    test('is false if product is in stock and an in stock option is selected', () => {
        const tree = createTestInstance(
            <Component {...configurableProductProps} />
        );
        const { root } = tree;

        act(() => {
            root.findByType('i').props.talonProps.handleSelectionChange('1', 2);
        });

        const { talonProps } = root.findByType('i').props;

        expect(talonProps.isOutOfStock).toBeFalsy();
        expect(talonProps.isAddToCartDisabled).toBeFalsy();
    });

    test('is true if product is in stock and an out of stock option is selected and disabled', () => {
        const tree = createTestInstance(
            <Component {...configurableProductProps} />
        );

        const { root } = tree;
        act(() => {
            root.findByType('i').props.talonProps.handleSelectionChange('1', 3);
        });

        const { talonProps } = root.findByType('i').props;

        expect(talonProps.isOutOfStock).toBeTruthy();
        expect(talonProps.isAddToCartDisabled).toBeTruthy();
    });

    test('is true (and should not error) if product is in stock and a disabled option is selected', () => {
        const tree = createTestInstance(
            <Component {...configurableProductProps} />
        );

        const { root } = tree;
        act(() => {
            root.findByType('i').props.talonProps.handleSelectionChange('1', 4);
        });

        const { talonProps } = root.findByType('i').props;

        expect(talonProps.isOutOfStock).toBeTruthy();
        expect(talonProps.isAddToCartDisabled).toBeTruthy();
    });
});

describe('shouldShowWishlistButton', () => {
    test('is false if not signed in', () => {
        useUserContext.mockReturnValueOnce([{ isSignedIn: false }]);
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.shouldShowWishlistButton).toBeFalsy();
    });

    test('is false if wishlist is disabled in config', () => {
        useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
        useQuery.mockReturnValueOnce({
            data: {
                storeConfig: {
                    magento_wishlist_general_is_enabled: false
                }
            },
            loading: false,
            error: false
        });
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.shouldShowWishlistButton).toBeFalsy();
    });

    test('is true if signed in and wishlist is enabled', () => {
        useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
        useQuery.mockReturnValueOnce({
            data: {
                storeConfig: {
                    magento_wishlist_general_is_enabled: true
                }
            },
            loading: false,
            error: false
        });
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.shouldShowWishlistButton).toBeTruthy();
    });
});

describe('wishlistItemOptions', () => {
    test('returns quantity and sku for all products', () => {
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.wishlistItemOptions).toMatchObject({
            quantity: 1,
            sku: defaultProps.product.sku
        });
    });

    test('returns selected_options for ConfigurableProducts', () => {
        const optionId = '1';
        const selectionId = 2;
        const uid = '20';

        const props = configurableProductProps;
        const tree = createTestInstance(<Component {...props} />);

        const { root } = tree;

        expect(
            root.findByType('i').props.talonProps.wishlistItemOptions
        ).toMatchObject({
            quantity: 1,
            sku: props.product.sku,
            selected_options: []
        });

        act(() => {
            root.findByType('i').props.talonProps.handleSelectionChange(
                optionId,
                selectionId
            );
        });

        expect(
            root.findByType('i').props.talonProps.wishlistItemOptions
        ).toMatchObject({
            quantity: 1,
            sku: props.product.sku,
            selected_options: [uid]
        });
    });
});

test('returns undefined category if there are no categories for the product', () => {
    const props = {
        ...defaultProps,
        categories: []
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.breadcrumbCategoryId).toBeUndefined();
});

test('returns an error message if add simple product mutation returns an error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: false, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: new Error('OMG A SIMPLE ERROR!'), loading: false }
    ]);

    const props = {
        ...defaultProps
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('OMG A SIMPLE ERROR!');
});

test('returns an error message if add configurable product mutation returns an error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: new Error('OMG A CONFIGURABLE ERROR!'), loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: false, loading: false }
    ]);

    const props = {
        ...defaultProps
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('OMG A CONFIGURABLE ERROR!');
});

test('returns an error message if generic add product mutation returns an error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: false, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: false, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: new Error('OMG A GENERIC ERROR!'), loading: false }
    ]);

    const props = {
        product: defaultProps.product
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('OMG A GENERIC ERROR!');
});

test('sets isAddToCartDisabled true if add configurable mutation is loading', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: true }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: false }
    ]);

    const props = {
        ...defaultProps
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isAddToCartDisabled).toBe(true);
});

test('sets isAddToCartDisabled true if add simple mutation is loading', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: true }
    ]);

    const props = {
        ...defaultProps
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isAddToCartDisabled).toBe(true);
});

test('sets isAddToCartDisabled true if generic add mutation is loading', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: true }
    ]);

    const props = {
        product: defaultProps.product
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isAddToCartDisabled).toBe(true);
});

test('returns correct value for supported product type', () => {
    const tree = createTestInstance(<Component {...defaultProps} />);

    const { root } = tree;
    const { talonProps: talonProps1 } = root.findByType('i').props;

    tree.update(
        <Component
            product={{
                ...defaultProps.product,
                __typename: 'Unsupported Type'
            }}
        />
    );

    const { talonProps: talonProps2 } = root.findByType('i').props;

    expect(talonProps1.isSupportedProductType).toBe(true);
    expect(talonProps2.isSupportedProductType).toBe(false);
});

test('calls generic mutation when no deprecated operation props are passed', async () => {
    const mockAddSimpleToCart = jest.fn();
    const mockAddConfigurableToCart = jest.fn();
    const mockAddProductToCart = jest.fn();
    useMutation.mockReturnValueOnce([
        mockAddConfigurableToCart,
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        mockAddSimpleToCart,
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        mockAddProductToCart,
        { error: null, loading: false }
    ]);

    const props = {
        product: defaultProps.product
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps: talonPropsStep1 } = root.findByType('i').props;
    const { handleAddToCart } = talonPropsStep1;

    await handleAddToCart({ quantity: 2 });
    expect(mockAddSimpleToCart).not.toHaveBeenCalled();
    expect(mockAddConfigurableToCart).not.toHaveBeenCalled();
    expect(mockAddProductToCart.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "variables": Object {
            "cartId": "ThisIsMyCart",
            "entered_options": Array [
              Object {
                "uid": "NDA=",
                "value": "Strive Shoulder Pac",
              },
            ],
            "product": Object {
              "quantity": 2,
              "sku": "MySimpleProductSku",
            },
          },
        }
    `);
});

test('it returns text when render prop is executed', () => {
    const tree = createTestInstance(<Component {...defaultProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(
        talonProps.wishlistButtonProps.buttonText(true)
    ).toMatchInlineSnapshot(`"Added to Favorites"`);

    expect(
        talonProps.wishlistButtonProps.buttonText(false)
    ).toMatchInlineSnapshot(`"Add to Favorites"`);
});

test('custom attribute is sorted', () => {
    const tree = createTestInstance(
        <Component {...outOfOrderCustomAttributeProductProps} />
    );

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.customAttributes).toMatchSnapshot();
});

test('should dispatch event on add to cart', async () => {
    const mockDispatch = jest.fn();

    useEventingContext.mockReturnValue([
        {},
        {
            dispatch: mockDispatch
        }
    ]);

    const tree = createTestInstance(
        <Component product={defaultProps.product} />
    );

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const { handleAddToCart } = talonProps;

    await handleAddToCart({ quantity: 2 });

    expect(mockDispatch).toBeCalledTimes(1);

    expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
});

describe('with configurable product options', () => {
    test('calls getOutOfStockVariants() with empty selections on initial render', () => {
        createTestInstance(
            <Component {...configurableProductWithTwoOptionGroupProps} />
        );

        expect(getOutOfStockVariants).toHaveBeenCalledTimes(1);
        // singleOptionSelection
        expect(getOutOfStockVariants.mock.calls[0][2]).toMatchInlineSnapshot(
            `undefined`
        );
        // optionSelections
        expect(getOutOfStockVariants.mock.calls[0][3]).toMatchInlineSnapshot(`
            Map {
              "179" => undefined,
              "190" => undefined,
            }
        `);
    });
    test('calls getOutOfStockVariants() with the correct selection values when handleSelectionChange() is called', () => {
        const tree = createTestInstance(
            <Component {...configurableProductWithTwoOptionGroupProps} />
        );

        const { root } = tree;

        // Select a fashion color
        act(() => {
            root.findByType('i').props.talonProps.handleSelectionChange(
                '179',
                14
            );
        });
        expect(getOutOfStockVariants).toHaveBeenCalledTimes(2);
        // singleOptionSelection
        expect(getOutOfStockVariants.mock.calls[1][2]).toMatchInlineSnapshot(`
            Map {
              "179" => 14,
            }
        `);
        // optionSelections
        expect(getOutOfStockVariants.mock.calls[1][3]).toMatchInlineSnapshot(`
            Map {
              "179" => 14,
              "190" => undefined,
            }
        `);

        // Select a fashion size
        act(() => {
            root.findByType('i').props.talonProps.handleSelectionChange(
                '190',
                45
            );
        });
        expect(getOutOfStockVariants).toHaveBeenCalledTimes(3);
        // singleOptionSelection
        expect(getOutOfStockVariants.mock.calls[2][2]).toMatchInlineSnapshot(`
            Map {
              "190" => 45,
            }
        `);
        // optionSelections
        expect(getOutOfStockVariants.mock.calls[2][3]).toMatchInlineSnapshot(`
            Map {
              "179" => 14,
              "190" => 45,
            }
        `);
    });
});

describe('when everything is out of stock', () => {
    test('sets the everythingIsOutOfStock value correctly', () => {
        const tree = createTestInstance(
            <Component {...configurableOutOfStockProductProps} />
        );

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.isEverythingOutOfStock).toBeTruthy();
        expect(talonProps.isAddToCartDisabled).toBeTruthy();
    });
});
