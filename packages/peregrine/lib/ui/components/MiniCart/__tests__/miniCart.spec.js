import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import MiniCart from '../miniCart';

jest.mock('../../../classify');
jest.mock('../../StockStatusMessage', () => props => (
    <mock-StockStatusMessage {...props} />
));
jest.mock('../ProductList', () => () => <mock-ProductList />);

jest.mock('@magento/peregrine', () => ({
    Price: jest.fn(props => {
        const priceString = `$${props.value}`;
        return <span>{priceString}</span>;
    }),
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
        subTotal: { currency: 'USD', value: 420 },
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
