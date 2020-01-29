import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import Quantity from '../quantity';

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

const mockOnChange = jest.fn();
const defaultProps = {
    itemId: 123,
    initialValue: 1,
    onChange: mockOnChange
};

test('renders quantity correctly', () => {
    const tree = createTestInstance(<Quantity {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('disables inc/dec buttons if no value', () => {
    const tree = createTestInstance(<Quantity {...defaultProps} />);

    tree.root.findByProps({ className: 'input' }).props.onChange({
        target: { value: undefined }
    });

    expect(
        tree.root.findByProps({ className: 'button_decrement' }).props.disabled
    ).toBe(true);
    expect(
        tree.root.findByProps({ className: 'button_increment' }).props.disabled
    ).toBe(true);
});

test('increments value on increment button click', () => {
    const tree = createTestInstance(<Quantity {...defaultProps} />);

    const oldValue = tree.root.findByProps({ className: 'input' }).props.value;

    act(() => {
        tree.root
            .findByProps({ className: 'button_increment' })
            .props.onClick();
    });

    const newValue = tree.root.findByProps({ className: 'input' }).props.value;
    expect(newValue).toBe(oldValue + 1);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, oldValue + 1);
});

test('decrements value on decrement button click', () => {
    const props = {
        ...defaultProps,
        initialValue: 2
    };
    const tree = createTestInstance(<Quantity {...props} />);

    const oldValue = tree.root.findByProps({ className: 'input' }).props.value;

    act(() => {
        tree.root
            .findByProps({ className: 'button_decrement' })
            .props.onClick();
    });

    const newValue = tree.root.findByProps({ className: 'input' }).props.value;
    expect(newValue).toBe(oldValue - 1);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, oldValue - 1);
});

test('input change restrains value to a min of 0', () => {
    const tree = createTestInstance(<Quantity {...defaultProps} />);

    act(() => {
        tree.root.findByProps({ className: 'input' }).props.onChange({
            target: { value: -1 }
        });
    });

    act(() => {
        expect(tree.root.findByProps({ className: 'input' }).props.value).toBe(
            0
        );
    });
});
