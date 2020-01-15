import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import Product from '../product';

jest.mock('../../../../classify');
jest.mock('@apollo/react-hooks', () => {
    const executeMutation = jest.fn(() => ({ error: null }));
    const useMutation = jest.fn(() => [executeMutation]);

    return { useMutation };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine', () => {
    const Price = props => <span>{`$${props.value}`}</span>;

    return {
        ...jest.requireActual('@magento/peregrine'),
        Price
    };
});

const props = {
    item: {
        id: '123',
        product: {
            name: 'Unit Test Product',
            small_image: {
                url: 'unittest.jpg'
            }
        },
        prices: {
            price: {
                currency: 'USD',
                value: 100
            }
        },
        quantity: 1
    }
};

test('renders simple product correctly', () => {
    const tree = createTestInstance(<Product {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders mask on removal', () => {
    const propsWithClass = {
        ...props,
        classes: {
            root: 'root',
            mask: 'mask'
        }
    };
    const tree = createTestInstance(<Product {...propsWithClass} />);
    const { root } = tree;
    const { onClick } = root.findByProps({ text: 'Remove from cart' }).props;

    act(() => {
        onClick();
    });

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders configurable product correctly', () => {
    const configurableProps = {
        item: {
            ...props.item,
            configurable_options: [
                {
                    option_label: 'Option 1',
                    value_label: 'Value 1'
                },
                {
                    option_label: 'Option 2',
                    value_label: 'Value 2'
                }
            ]
        }
    };
    const tree = createTestInstance(<Product {...configurableProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
