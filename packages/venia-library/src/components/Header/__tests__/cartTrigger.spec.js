import React from 'react';
import { mount } from 'enzyme';
import { Trigger } from '../cartTrigger';

const classes = {
    root: 'a'
};

const toggleCart = jest.fn();

test('Cart icon layout is outline only, when cart is empty', () => {
    const props = {
        cart: {
            details: {
                items_qty: 0
            }
        }
    };
    const wrapper = mount(
        <Trigger {...props} classes={classes} toggleCart={toggleCart} />
    );
    expect(wrapper.find('svg').prop('fill')).toContain('none');
});

test('Cart icon layout is filled, when cart contains items', () => {
    const props = {
        cart: {
            details: {
                items_qty: 1
            }
        }
    };
    const wrapper = mount(
        <Trigger {...props} classes={classes} toggleCart={toggleCart} />
    );
    expect(wrapper.find('svg').prop('fill')).not.toContain('none');
});
