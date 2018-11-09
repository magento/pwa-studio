import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Kebab from '../kebab';

configure({ adapter: new Adapter() });

const classes = {
    root: 'a',
    dropdown: 'b',
    dropdown_active: 'c'
};

const item = {
    id: 1,
    name: 'Test Product 1',
    small_image: '/test/product/1.png',
    price: {
        regularPrice: {
            amount: {
                value: 100,
                currency: 'USD'
            }
        }
    }
};

test('renders with item data', () => {
    const wrapper = shallow(<Kebab classes={classes} item={item} />).dive();

    expect(wrapper.hasClass(classes.root)).toBe(true);
});

test('list is inactive when kebab is closed', () => {
    const wrapper = shallow(<Kebab classes={classes} isOpen={false} />).dive();

    let menu = wrapper.find('ul');
    expect(menu.hasClass(classes.dropdown)).toBe(true);
    expect(menu.hasClass(classes.dropdown_active)).toBe(false);
});

test('list gains "active" class when kebab is open', () => {
    const wrapper = shallow(<Kebab classes={classes} isOpen={true} />).dive();

    let menu = wrapper.find('ul');
    expect(menu.hasClass(classes.dropdown_active)).toBe(true);
});
