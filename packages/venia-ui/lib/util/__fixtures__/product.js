/**
 * A mock configurable product.
 */
const product = {
    __typename: 'ConfigurableProduct',
    id: 1093,
    sku: 'VT12',
    name: 'Jillian Top',
    configurable_options: [
        {
            attribute_code: 'fashion_color',
            attribute_id: '176',
            id: 2,
            label: 'Fashion Color',
            values: [
                {
                    default_label: 'Peach',
                    label: 'Peach',
                    store_label: 'Peach',
                    use_default_value: true,
                    value_index: 18,
                    __typename: 'ConfigurableProductOptionsValues'
                },
                {
                    default_label: 'Khaki',
                    label: 'Khaki',
                    store_label: 'Khaki',
                    use_default_value: true,
                    value_index: 19,
                    __typename: 'ConfigurableProductOptionsValues'
                },
                {
                    default_label: 'Lilac',
                    label: 'Lilac',
                    store_label: 'Lilac',
                    use_default_value: true,
                    value_index: 20,
                    __typename: 'ConfigurableProductOptionsValues'
                },
                {
                    default_label: 'Rain',
                    label: 'Rain',
                    store_label: 'Rain',
                    use_default_value: true,
                    value_index: 21,
                    __typename: 'ConfigurableProductOptionsValues'
                }
            ],
            __typename: 'ConfigurableProductOptions'
        },
        {
            attribute_code: 'fashion_size',
            attribute_id: '179',
            id: 3,
            label: 'Fashion Size',
            values: [
                {
                    default_label: 'L',
                    label: 'L',
                    store_label: 'L',
                    use_default_value: true,
                    value_index: 26,
                    __typename: 'ConfigurableProductOptionsValues'
                },
                {
                    default_label: 'M',
                    label: 'M',
                    store_label: 'M',
                    use_default_value: true,
                    value_index: 27,
                    __typename: 'ConfigurableProductOptionsValues'
                },
                {
                    default_label: 'S',
                    label: 'S',
                    store_label: 'S',
                    use_default_value: true,
                    value_index: 28,
                    __typename: 'ConfigurableProductOptionsValues'
                },
                {
                    default_label: 'XS',
                    label: 'XS',
                    store_label: 'XS',
                    use_default_value: true,
                    value_index: 29,
                    __typename: 'ConfigurableProductOptionsValues'
                }
            ],
            __typename: 'ConfigurableProductOptions'
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 19,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 28,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 26,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-kh_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-KH-S',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 20,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 28,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 22,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-ll_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-LL-S',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 18,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 28,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 18,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-pe_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-PE-S',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 21,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 28,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 14,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-rn_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-RN-S',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 19,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 29,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 25,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-kh_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-KH-XS',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 20,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 29,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 21,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-ll_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-LL-XS',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 18,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 29,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 17,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-pe_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-PE-XS',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 21,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 29,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 13,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-rn_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-RN-XS',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 19,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 27,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 27,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-kh_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-KH-M',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 20,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 27,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 23,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-ll_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-LL-M',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 18,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 27,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 19,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-pe_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-PE-M',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 21,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 27,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 15,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-rn_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-RN-M',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 19,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 26,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 28,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-kh_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-KH-L',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 20,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 26,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 24,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-ll_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-LL-L',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 18,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 26,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 20,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-pe_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-PE-L',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        },
        {
            attributes: [
                {
                    code: 'fashion_color',
                    value_index: 21,
                    __typename: 'ConfigurableAttributeOption'
                },
                {
                    code: 'fashion_size',
                    value_index: 26,
                    __typename: 'ConfigurableAttributeOption'
                }
            ],
            product: {
                id: 16,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/v/t/vt12-rn_main_1.jpg',
                        label: 'Main',
                        position: 1,
                        __typename: 'MediaGalleryEntry'
                    }
                ],
                sku: 'VT12-RN-L',
                stock_status: 'IN_STOCK',
                __typename: 'SimpleProduct'
            },
            __typename: 'ConfigurableVariant'
        }
    ]
};

/**
 * A mock simple product that is a variant of the configurable product above.
 */
const variant = {
    item_id: 1791,
    sku: 'VT12-LL-L',
    qty: 1,
    name: 'Jillian Top',
    price: 46,
    product_type: 'configurable',
    quote_id: '3795',
    image: {
        disabled: false,
        file: '/v/t/vt12-ll_main_1.jpg',
        label: 'Main',
        position: 1,
        __typename: 'MediaGalleryEntry'
    },
    options: [
        {
            value: 'L',
            label: 'Fashion Size'
        },
        {
            value: 'Lilac',
            label: 'Fashion Color'
        }
    ]
};

export { product, variant };
