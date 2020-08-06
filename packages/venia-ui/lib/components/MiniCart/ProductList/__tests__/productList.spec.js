import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductList from '../productList';

jest.mock('../../../../classify');
jest.mock('@magento/venia-drivers', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    resourceUrl: x => x
}));

const props = {
    items: [
        {
            product: {
                name: 'P1',
                url_key: 'product',
                url_suffix: '.html',
                thumbnail: {
                    url: 'www.venia.com/p1'
                }
            },
            id: 'p1',
            quantity: 10,
            configurable_options: [
                {
                    option_label: 'Color',
                    value_label: 'red'
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
