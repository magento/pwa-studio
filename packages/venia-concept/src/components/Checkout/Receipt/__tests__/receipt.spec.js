import React from 'react';
import testRenderer, { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';
import { shallow } from 'enzyme';

import Receipt from '../receipt';
import Button from 'src/components/Button';

const classes = {
    header: 'header',
    textBlock: 'textBlock'
};

jest.mock('src/classify');

const userProp = { isSignedIn: false };

test('renders a Receipt component correctly', () => {
    const props = {
        order: { id: '123' },
        createAccount: jest.fn(),
        reset: jest.fn(),
        user: userProp
    };

    const component = testRenderer.create(<Receipt {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls `handleCreateAccount` when `Create an Account` button is pressed', () => {
    const handleCreateAccountMock = jest.fn();

    const wrapper = shallow(
        <Receipt
            createAccount={handleCreateAccountMock}
            classes={classes}
            user={userProp}
        />
    );

    wrapper.find(Button).simulate('click');

    expect(handleCreateAccountMock).toBeCalled();
});

test('calls `reset` when component was unmounted', () => {
    const resetHandlerMock = jest.fn();

    const instance = createTestInstance(
        <Receipt reset={resetHandlerMock} classes={classes} user={userProp} />
    );

    act(() => {
        instance.unmount();
    });

    expect(resetHandlerMock).toBeCalled();
});
