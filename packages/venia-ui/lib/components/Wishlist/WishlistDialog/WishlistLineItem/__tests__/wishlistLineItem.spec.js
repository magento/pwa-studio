import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import WishlistLineItem from '../wishlistLineItem';
import { act } from 'react-test-renderer';

jest.mock('@magento/venia-ui/lib/classify');

const onClickMock = jest.fn();
const defaultProps = {
    id: 1,
    isDisabled: false,
    onClick: onClickMock
};

test('renders the correct tree', () => {
    const tree = createTestInstance(<WishlistLineItem {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders a disabled button', () => {
    const props = { ...defaultProps, disabled: true };
    const { root } = createTestInstance(<WishlistLineItem {...props} />);
    expect(root.findByProps({ className: 'root' }).props.disabled).toBe(false);
});

test('clicking invokes onClick prop with id', () => {
    const props = { ...defaultProps, disabled: true };
    const { root } = createTestInstance(<WishlistLineItem {...props} />);

    act(() => {
        root.findByProps({ className: 'root' }).props.onClick();
    });

    expect(onClickMock).toHaveBeenCalled();
});
