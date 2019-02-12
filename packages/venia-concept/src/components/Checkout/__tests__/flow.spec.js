import React from 'react';
import testRenderer from 'react-test-renderer';
import Flow from '../flow';

import Cart from '../cart';
import Form from '../form';
import Receipt from '../Receipt';

jest.mock('src/classify');
jest.mock('../cart');
jest.mock('../form');
jest.mock('../Receipt', () => '');

const defaultProps = {
    actions: {},
    checkout: {
        step: 'cart'
    }
};

test('renders Cart component', () => {
    const props = {
        ...defaultProps
    };
    const component = testRenderer.create(<Flow {...props} />);

    expect(() => component.root.findByType(Cart)).not.toThrow();
});

test('renders Form component', () => {
    const props = {
        ...defaultProps,
        checkout: {
            step: 'form'
        }
    };
    const component = testRenderer.create(<Flow {...props} />);

    expect(() => component.root.findByType(Form)).not.toThrow();
});

test('renders Receipt component', () => {
    const props = {
        ...defaultProps,
        checkout: {
            step: 'receipt'
        }
    };
    const component = testRenderer.create(<Flow {...props} />);

    expect(() => component.root.findByType(Receipt)).not.toThrow();
});

test('renders null if checkout/cart props are falsy', () => {
    const props = {
        ...defaultProps,
        checkout: false,
        cart: false
    };
    const component = testRenderer.create(<Flow {...props} />);

    expect(() => component.root.findByType(Cart)).toThrow();
    expect(() => component.root.findByType(Form)).toThrow();
    expect(() => component.root.findByType(Receipt)).toThrow();
});
