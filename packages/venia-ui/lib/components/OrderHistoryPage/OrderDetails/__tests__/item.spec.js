import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Item from '../item';
import PlaceholderImage from '../../../Image/placeholderImage';

jest.mock('react-router-dom', () => ({
    Link: props => <div componentName="Link Component" {...props} />
}));

jest.mock(
    '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext',
    () => ({
        useOrderHistoryContext: jest
            .fn()
            .mockReturnValue({ productURLSuffix: '.html' })
    })
);

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

test('should render placeholder without thumbnail', () => {
    const props = {
        ...defaultProps,
        thumbnail: undefined
    };
    const tree = createTestInstance(<Item {...props} />);
    const { root } = tree;
    const imagePlaceholderNode = root.findByType(PlaceholderImage);

    expect(imagePlaceholderNode).toBeTruthy();
});
