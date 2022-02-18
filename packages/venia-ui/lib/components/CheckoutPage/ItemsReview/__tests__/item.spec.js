import React from 'react';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import Item from '../item';

jest.mock('../../../LegacyMiniCart/productOptions', () => props => (
    <mock-ProductOptions {...props} />
));

jest.mock('../../../Image', () => props => <mock-Image {...props} />);

test('Snapshot test', () => {
    const tree = createTestInstance(
        <Item
            product={{ name: '', thumbnail: { url: 'www.venia.com/p1' } }}
            quantity={5}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Snapshot test when configured to use variant image', () => {
    const product = {
        name: 'P1',
        url_key: 'product',
        url_suffix: '.html',
        thumbnail: {
            url: 'www.venia.com/p1'
        },
        variants: [
            {
                attributes: [
                    {
                        uid: 'Y29uZmlndXJhYmxlLzIyLzI='
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
                        uid: 'Y29uZmlndXJhYmxlLzIyLzM='
                    }
                ],
                product: {
                    thumbnail: {
                        url: 'www.venia.com/p1-variant2'
                    }
                }
            }
        ]
    };
    const configurable_options = [
        {
            option_label: 'Color',
            value_label: 'red',
            configurable_product_option_uid: 22,
            configurable_product_option_value_uid: 'Y29uZmlndXJhYmxlLzIyLzI='
        }
    ];
    const tree = createTestInstance(
        <Item
            product={product}
            configurable_options={configurable_options}
            quantity={5}
            configurableThumbnailSource={'itself'}
        />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
