import React from 'react';
import testRenderer, { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';
import { shallow } from 'enzyme';

import Receipt from '../receipt';
import Button from '../../../Button';

const classes = {
    header: 'header',
    textBlock: 'textBlock'
};

jest.mock('../../../../classify');

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
            onClose={() => {}}
            user={userProp}
        />
    );

    wrapper.find(Button).simulate('click');

    expect(handleCreateAccountMock).toBeCalled();
});

test('calls `reset` and `onClose` when cart drawer is closed', () => {
    const resetHandlerMock = jest.fn();
    const onCloseMock = jest.fn();

    const instance = createTestInstance(
        <Receipt
            drawer={'cart'}
            reset={resetHandlerMock}
            classes={classes}
            user={userProp}
            onClose={onCloseMock}
        />
    );

    act(() => {
        instance.update(
            <Receipt
                drawer={null}
                reset={resetHandlerMock}
                classes={classes}
                user={userProp}
                onClose={onCloseMock}
            />
        );
    });

    expect(resetHandlerMock).toBeCalled();
    expect(onCloseMock).toBeCalled();
});
