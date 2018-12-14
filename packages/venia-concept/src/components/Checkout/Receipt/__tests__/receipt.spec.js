import React from 'react';
import { shallow } from 'enzyme';
import Button from 'src/components/Button';
import Receipt, {
    CREATE_ACCOUNT_BUTTON_ID,
    CONTINUE_SHOPPING_BUTTON_ID
} from '../receipt';

const classes = {
    header: 'header',
    textBlock: 'textBlock'
};

test('renders correctly', () => {
    const wrapper = shallow(<Receipt classes={classes} />).dive();

    expect(wrapper.find(`.${classes.header}`)).toHaveLength(1);
    expect(wrapper.find(`.${classes.textBlock}`)).toHaveLength(2);
    expect(wrapper.find(Button)).toHaveLength(2);
});

test('calls `handleContinueShopping` when `Continue Shopping` button is pressed', () => {
    const handleContinueShoppingMock = jest.fn();

    const wrapper = shallow(
        <Receipt
            continueShopping={handleContinueShoppingMock}
            classes={classes}
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
        <Receipt createAccount={handleCreateAccountMock} classes={classes} />
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
        <Receipt reset={resetHandlerMock} classes={classes} />
    ).dive();

    wrapper.unmount();

    expect(resetHandlerMock).toBeCalled();
});
