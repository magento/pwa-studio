import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useItem } from '@magento/peregrine/lib/talons/MiniCart/useItem';

import Item from '../item';

jest.mock('../../../../classify');
jest.mock('@magento/peregrine/lib/talons/MiniCart/useItem', () => ({
    useItem: jest.fn().mockReturnValue({
        isDeleting: false,
        removeItem: () => {}
    })
}));
jest.mock('@magento/venia-drivers', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    resourceUrl: x => x
}));

const props = {
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

test('Should render correctly with out of stock product', () => {
    const outOfStockProps = {
        ...props,
        product: {
            ...props.product,
            stock_status: 'OUT_OF_STOCK'
        }
    };
    const tree = createTestInstance(<Item {...outOfStockProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should disable delete icon while loading', () => {
    useItem.mockReturnValueOnce({
        isDeleting: true,
        removeItem: () => {}
    });
    const tree = createTestInstance(<Item {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
