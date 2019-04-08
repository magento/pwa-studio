import React from 'react';
import { shallow } from 'enzyme';

import Kebab from '../kebab';

const classes = {
    root: 'a',
    dropdown: 'b',
    dropdown_active: 'c'
};

const items = [
    {
        id: 1,
        name: 'Test Product 1',
        small_image: {
            url: '/test/product/1.png'
        },
        price: {
            regularPrice: {
                amount: {
                    value: 100,
                    currency: 'USD'
                }
            }
        }
    },
    {
        id: 2,
        name: 'Backward Compatible Test Product 2',
        small_image: '/test/product/1.png',
        price: {
            regularPrice: {
                amount: {
                    value: 100,
                    currency: 'USD'
                }
            }
        }
    }
];

test('renders with item data', () => {
    items.forEach(item => {
        const wrapper = shallow(<Kebab classes={classes} item={item} />).dive();
        expect(wrapper.hasClass(classes.root)).toBe(true);
    });
});

test('list is inactive when kebab is closed', () => {
    const wrapper = shallow(<Kebab classes={classes} isOpen={false} />).dive();

    const menu = wrapper.find('ul');
    expect(menu.hasClass(classes.dropdown)).toBe(true);
    expect(menu.hasClass(classes.dropdown_active)).toBe(false);
});

test('list gains "active" class when kebab is open', () => {
    const wrapper = shallow(<Kebab classes={classes} />).dive();
    wrapper.setState({ isOpen: true });

    const menu = wrapper.find('ul');
    expect(menu.hasClass(classes.dropdown_active)).toBe(true);
});
