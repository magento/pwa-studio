import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductList from '../productList';

jest.mock('../../../../classify');
jest.mock('../item', () => 'Item');
jest.mock('@magento/venia-drivers', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    resourceUrl: x => x
}));

const props = {
    closeMiniCart: jest.fn().mockName('closeMiniCart'),
    handleRemoveItem: jest.fn().mockName('handleRemoveItem'),
    items: [
        {
            id: '1',
            product: {
                name: 'Simple Product'
            }
        }
    ]
};

test('Should render properly', () => {
    const tree = createTestInstance(<ProductList {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
