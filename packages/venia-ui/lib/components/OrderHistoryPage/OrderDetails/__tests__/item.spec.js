import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Item from '../item';

jest.mock('react-router-dom', () => ({
    Link: props => <div componentName="Link Component" {...props} />
}));

const defaultProps = {
    product_name: 'Product 1',
    product_sale_price: {
        currency: 'USD',
        value: 100
    },
    product_url_key: 'carina-cardigan',
    quantity_ordered: 3,
    selected_options: [
        {
            label: 'Color',
            value: 'Black'
        }
    ],
    thumbnail: { url: 'https://www.venia.com/product1-thumbnail.jpg' }
};

test('should render properly', () => {
    const tree = createTestInstance(<Item {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
