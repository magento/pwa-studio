import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Receipt from '../receipt';
import Button from 'src/components/Button';

configure({ adapter: new Adapter() });

const classes = {
    header: 'header',
    textBlock: 'textBlock',
    resetCheckoutButtonClasses: {},
    createAccountButtonClasses: {}
};

test('renders correctly', () => {
    const wrapper = shallow(<Receipt classes={classes} />).dive();

    expect(wrapper.find(`.${classes.header}`)).toHaveLength(1);
    expect(wrapper.find(`.${classes.textBlock}`)).toHaveLength(2);
    expect(wrapper.find(Button)).toHaveLength(2);
});

test('calls `resetCheckout` when `Continue Shopping` button is pressed', () => {
    const resetCheckout = jest.fn();

    const wrapper = shallow(
        <Receipt resetCheckout={resetCheckout} classes={classes} />
    ).dive();
    wrapper
        .find(Button)
        .findWhere(
            el => el.props().classes === classes.resetCheckoutButtonClasses
        )
        .first()
        .simulate('click');
    expect(resetCheckout).toBeCalled();
});

test('calls `handleCreateAccount` when `Create an Account` button is pressed', () => {
    const handleCreateAccountMock = jest.fn();

    const wrapper = shallow(
        <Receipt
            handleCreateAccount={handleCreateAccountMock}
            classes={classes}
        />
    ).dive();

    wrapper
        .find(Button)
        .findWhere(
            el => el.props().classes === classes.createAccountButtonClasses
        )
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
