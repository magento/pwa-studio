import React from 'react';
import testRenderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Receipt, {
    CREATE_ACCOUNT_BUTTON_ID,
    CONTINUE_SHOPPING_BUTTON_ID
} from '../receipt';

const classes = {
    header: 'header',
    textBlock: 'textBlock'
};

jest.mock('src/classify');

const userProp = { isSignedIn: false };

test('renders a Receipt component correctly', () => {
    const props = {
        continueShopping: jest.fn(),
        order: { id: '123' },
        createAccount: jest.fn(),
        reset: jest.fn(),
        user: userProp
    };

    const component = testRenderer.create(<Receipt {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls `handleContinueShopping` when `Continue Shopping` button is pressed', () => {
    const handleContinueShoppingMock = jest.fn();

    const wrapper = shallow(
        <Receipt
            continueShopping={handleContinueShoppingMock}
            classes={classes}
            user={userProp}
        />
    ).dive();
    wrapper
        .findWhere(el => el.prop('data-id') === CONTINUE_SHOPPING_BUTTON_ID)
        .first()
        .simulate('click');
    expect(handleContinueShoppingMock).toBeCalled();
});

test('calls `handleCreateAccount` when `Create an Account` button is pressed', () => {
    const handleCreateAccountMock = jest.fn();

    const wrapper = shallow(
        <Receipt
            createAccount={handleCreateAccountMock}
            classes={classes}
            user={userProp}
        />
    ).dive();

    wrapper
        .findWhere(el => el.prop('data-id') === CREATE_ACCOUNT_BUTTON_ID)
        .first()
        .simulate('click');

    expect(handleCreateAccountMock).toBeCalled();
});

test('calls `reset` when component was unmounted', () => {
    const resetHandlerMock = jest.fn();

    const wrapper = shallow(
        <Receipt reset={resetHandlerMock} classes={classes} user={userProp} />
    ).dive();

    wrapper.unmount();

    expect(resetHandlerMock).toBeCalled();
});
