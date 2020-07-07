import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Item from '../item';

jest.mock('../../../../classify');

const props = {
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
    handleRemoveItem: () => {},
    prices: {
        price: {
            value: 420,
            currency: 'USD'
        }
    }
};

test('Should render correctly', () => {
    const tree = createTestInstance(<Item {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
