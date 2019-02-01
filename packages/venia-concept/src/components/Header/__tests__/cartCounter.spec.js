import React from 'react';
import { shallow } from 'enzyme';
import CartCounter from '../cartCounter';

const classes = {
    root: 'a'
};

test('Cart counter is not rendered when cart is empty', () => {
    const itemsQty = 0;
    const wrapper = shallow(
        <CartCounter counter={itemsQty} classes={classes} />
    ).dive();
    expect(wrapper.find('span').exists()).toBe(false);
});

test('Cart counter is rendered when cart contains items', () => {
    const itemsQty = 1;
    const wrapper = shallow(
        <CartCounter counter={itemsQty} classes={classes} />
    ).dive();
    expect(wrapper.find('span').exists()).toBe(true);
});

test('Cart counter shows correct item quantity', () => {
    const itemsQty = 10;
    const wrapper = shallow(
        <CartCounter counter={itemsQty} classes={classes} />
    ).dive();
    expect(wrapper.find('span').text()).toContain(itemsQty);
});
