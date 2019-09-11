import React from 'react';
import testRenderer, { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import Receipt from '../receipt';
import Button from '../../../Button';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';

const classes = {
    header: 'header',
    textBlock: 'textBlock'
};

jest.mock('../../../../classify');

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

jest.mock('@magento/peregrine/lib/context/checkout', () => {
    const state = {};
    const api = { createAccount: jest.fn() };
    const useCheckoutContext = jest.fn(() => [state, api]);

    return { useCheckoutContext };
});

test('renders a Receipt component correctly', () => {
    const props = {
        order: { id: '123' },
        reset: jest.fn()
    };

    const component = testRenderer.create(<Receipt {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls `handleCreateAccount` when `Create an Account` button is pressed', () => {
    const [, { createAccount }] = useCheckoutContext();

    const wrapper = createTestInstance(
        <Receipt classes={classes} onClose={() => {}} />
    );

    wrapper.root.findByType(Button).props.onClick();
    expect(createAccount).toBeCalled();
});

test('calls `reset` when component was unmounted', () => {
    const resetHandlerMock = jest.fn();

    const instance = createTestInstance(
        <Receipt reset={resetHandlerMock} classes={classes} />
    );

    expect(resetHandlerMock).not.toBeCalled();

    act(() => {
        instance.unmount();
    });

    expect(resetHandlerMock).toBeCalled();
});
