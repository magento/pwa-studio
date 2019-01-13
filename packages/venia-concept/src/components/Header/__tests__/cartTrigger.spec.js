import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Trigger } from '../cartTrigger';

configure({ adapter: new Adapter() });

const classes = {
    root: "a"
}

test('Cart icon layout is outline only, when cart is empty', () => {
    const props = {
        cart: {
            details: {
                items_qty: 0
            }
        }
    };
    const toggleCart = jest.fn();
    const wrapper = mount( 
        <Trigger {...props} classes={classes} toggleCart={toggleCart} />
    ); 
    console.log(wrapper.debug());
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
    const toggleCart = jest.fn();
    const wrapper = mount( 
        <Trigger {...props} classes={classes} toggleCart={toggleCart} />
    ); 
    console.log(wrapper.debug());
    expect(wrapper.find('svg').prop('fill')).not.toContain('none');
});
