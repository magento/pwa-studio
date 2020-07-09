import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import MiniCart from '../miniCart';

jest.mock('../../../classify');
jest.mock('../ProductList', () => () => <div>Product List</div>);

jest.mock('@magento/peregrine', () => ({
    useScrollLock: jest.fn(),
    useToasts: jest.fn().mockReturnValue([
        {},
        {
            addToast: jest.fn()
        }
    ])
}));

jest.mock('@magento/peregrine/lib/talons/MiniCart/useMiniCart', () => ({
    useMiniCart: jest.fn().mockReturnValue({
        productList: [
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
        errors: null,
        totalQuantity: 10,
        handleRemoveItem: () => {}
    })
}));

test('it renders correctly', () => {
    // Arrange.
    const props = {
        isOpen: true
    };

    // Act.
    const instance = createTestInstance(<MiniCart {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
