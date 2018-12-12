import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Trigger } from '../cartTrigger';

configure({ adapter: new Adapter() });

const classes = { 
    root: 'a',
    counter: 'b'
};

test('Cart counter is not rendered when cart is empty', () => {
    const toggleCart =  jest.fn();
    const counter = 0;
    const wrapper = mount( // shallow can not be called on Host Components
        <Trigger 
            classes={classes}
            toggleCart={toggleCart}
            itemsQty={counter}
        />
    );
    expect(
        wrapper
            .find('span')
            .exists()
    ).toBe(false);
});

test('Cart counter is rendered when cart contains items', () => {
    const toggleCart =  jest.fn();
    const counter = 1;
    const wrapper = mount(
        <Trigger 
            classes={classes}
            toggleCart={toggleCart}
            itemsQty={counter}
        />
    );
    expect(
        wrapper
            .find('span')
            .exists()
    ).toBe(true);
});

test('Cart counter shows correct items in cart quantity', () => {
    const toggleCart =  jest.fn();
    const counter = 2;
    const wrapper = mount(
        <Trigger 
            classes={classes}
            toggleCart={toggleCart}
            itemsQty={counter}
        />
    );
    expect(
        wrapper
            .find('span')
            .text()
    ).toContain(counter);
});
