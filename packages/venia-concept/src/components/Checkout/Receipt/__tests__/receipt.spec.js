import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Receipt from '../receipt';
import Button from 'src/components/Button';

configure({ adapter: new Adapter() });

const classes = {
    header: 'header',
    textBlock: 'textBlock'
};

test('renders correctly', () => {
    const wrapper = shallow(<Receipt classes={classes} />).dive();
    expect(
        wrapper.find(Button).findWhere(x => x.text() === 'Continue Shopping')
    ).toHaveLength(1);
    expect(
        wrapper.find(Button).findWhere(x => x.text() === 'Create an Account')
    ).toHaveLength(1);
    expect(wrapper.find(`.${classes.header}`)).toHaveLength(1);
    expect(wrapper.find(`.${classes.textBlock}`)).toHaveLength(2);
});

test('pressing `continue shopping` leads to calling handler', () => {
    const resetCheckout = jest.fn();

    const wrapper = shallow(<Receipt resetCheckout={resetCheckout} />).dive();
    wrapper
        .find(Button)
        .first()
        .simulate('click');
    expect(resetCheckout).toBeCalled();
});
