import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Item from '../item';

jest.mock('@magento/venia-drivers', () => ({
    Link: props => <div componentName="Link Component" {...props} />,
    resourceUrl: url => url
}));

jest.mock('react-intl', () => ({
    FormattedMessage: props => (
        <div componentName="Formatted Message Component" {...props} />
    )
}));

const defaultProps = {
    product_name: 'Product 1',
    product_sale_price: '$100.00',
    quantity_ordered: 3,
    selected_options: [
        {
            label: 'Color',
            value: 'Black'
        }
    ],
    thumbnail: 'www.venia.com/product1-thumbnail.jpg',
    url_key: 'carina-cardigan',
    url_suffix: '.html'
};

test('should render properly', () => {
    const tree = createTestInstance(<Item {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
