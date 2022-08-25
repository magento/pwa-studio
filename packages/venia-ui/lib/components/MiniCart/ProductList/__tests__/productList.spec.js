import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductList from '../productList';

jest.mock('../../../../classify');
jest.mock('../item', () => 'Item');
jest.mock('react-router-dom', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>
}));
jest.mock('@magento/peregrine/lib/util/makeUrl');

const props = {
    closeMiniCart: jest.fn().mockName('closeMiniCart'),
    handleRemoveItem: jest.fn().mockName('handleRemoveItem'),
    items: [
        {
            uid: '1',
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
