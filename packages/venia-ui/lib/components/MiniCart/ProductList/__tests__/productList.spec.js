import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductList from '../productList';

jest.mock('../../../../classify');

const props = {
    items: [
        {
            product: {
                name: 'P1',
                thumbnail: {
                    url: 'www.venia.com/p1'
                }
            },
            id: 'p1',
            quantity: 10,
            configurable_options: [
                {
                    label: 'Color',
                    value: 'red'
                }
            ],
            prices: {
                price: {
                    value: 420,
                    currency: 'USD'
                }
            }
        }
    ],
    loading: false,
    handleRemoveItem: () => {}
};

test('Should render properly', () => {
    const tree = createTestInstance(<ProductList {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render loading indicator when loading is true', () => {
    const tree = createTestInstance(<ProductList {...props} loading={true} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
