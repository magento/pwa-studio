import configuredVariant from '../configuredVariant';

const configurableOptions = [
    {
        option_label: 'Size',
        value_label: 'medium',
        configurable_product_option_uid: 13,
        configurable_product_option_value_uid: 'Y29uZmlndXJhYmxlLzEvMQ=='
    },
    {
        option_label: 'Color',
        value_label: 'red',
        configurable_product_option_uid: 23,
        configurable_product_option_value_uid: 'Y29uZmlndXJhYmxlLzEvMg=='
    }
];

const product = {
    variants: [
        {
            attributes: [
                {
                    uid: 'Y29uZmlndXJhYmxlLzEvMw=='
                },
                {
                    uid: 'Y29uZmlndXJhYmxlLzEvMg=='
                }
            ],
            product: {
                thumbnail: {
                    url: 'www.venia.com/p1-variant1'
                }
            }
        },
        {
            attributes: [
                {
                    uid: 'Y29uZmlndXJhYmxlLzEvMQ=='
                },
                {
                    uid: 'Y29uZmlndXJhYmxlLzEvNw=='
                }
            ],
            product: {
                thumbnail: {
                    url: 'www.venia.com/p1-variant2'
                }
            }
        },
        {
            attributes: [
                {
                    uid: 'Y29uZmlndXJhYmxlLzEvMQ=='
                },
                {
                    uid: 'Y29uZmlndXJhYmxlLzEvMg=='
                }
            ],
            product: {
                thumbnail: {
                    url: 'www.venia.com/p1-variant3'
                }
            }
        },
        {
            attributes: [
                {
                    uid: 'Y29uZmlndXJhYmxlLzEvNA=='
                },
                {
                    uid: 'Y29uZmlndXJhYmxlLzEvOA=='
                }
            ],
            product: {
                thumbnail: {
                    url: 'www.venia.com/p1-variant4'
                }
            }
        }
    ]
};

it('Should return the correct product variant', () => {
    const result = configuredVariant(configurableOptions, product);

    expect(result).toEqual({
        thumbnail: {
            url: 'www.venia.com/p1-variant3'
        }
    });
});

it('Should return undefined if configured_options is falsy', () => {
    const result = configuredVariant(undefined, product);

    expect(result).toBe(undefined);
});

it('Should return undefined if product does not have property, variants', () => {
    const altProduct = {
        uid: 1
    };
    const result = configuredVariant(configurableOptions, altProduct);

    expect(result).toBe(undefined);
});

it('should not error out if product is undefined', () => {
    expect(() =>
        configuredVariant(configurableOptions, undefined)
    ).not.toThrowError();
});
