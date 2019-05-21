import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import CartOptions from '../cartOptions';

jest.mock('src/components/LoadingIndicator', () => {
    return {
        __esModule: true,
        default: () => '( Configurable Loading Indicator Component Here )',
        loadingIndicator: '( Loading Indicator Component Here )'
    };
});
test('it renders correctly', () => {
    const props = {
        cartItem: {
            item_id: 99,
            name: 'cartItem name',
            price: 99,
            qty: 99
        },
        configItem: {
            __typename: 'simple'
        },
        endEditItem: jest.fn(),
        updateCart: jest.fn()
    };
    
    const tree = createTestInstance(
        <CartOptions {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
