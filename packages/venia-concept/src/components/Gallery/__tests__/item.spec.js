import React from 'react';
import { shallow } from 'enzyme';
import { Link, MemoryRouter } from 'react-router-dom';

import Item from '../item';

const classes = {
    image: 'a',
    image_pending: 'b',
    imagePlaceholder: 'c',
    imagePlaceholder_pending: 'd',
    images: 'e',
    images_pending: 'f',
    name: 'g',
    name_pending: 'h',
    price: 'i',
    price_pending: 'j',
    root: 'k',
    root_pending: 'l'
};

const validItem = {
    id: 1,
    name: 'Test Product',
    small_image: '/foo/bar/pic.png',
    url_key: 'strive-shoulder-pack',
    price: {
        regularPrice: {
            amount: {
                value: 21,
                currency: 'USD'
            }
        }
    }
};

/**
 * STATE 0: awaiting item data
 * `item` is `null` or `undefined`
 */
test('renders a placeholder item while awaiting item', () => {
    const wrapper = shallow(<Item classes={classes} />).dive();
    const child = wrapper.find('ItemPlaceholder');
    const props = { classes };

    expect(child).toHaveLength(1);
    expect(child.props()).toMatchObject(props);
});

test('passes classnames to the placeholder item', () => {
    const wrapper = shallow(<Item classes={classes} />)
        .dive()
        .dive();

    expect(wrapper.hasClass(classes.root_pending));
});

test('renders Link elements for navigating to a PDP', () => {
    const wrapper = shallow(
        <MemoryRouter>
            <Item classes={classes} item={validItem} />
        </MemoryRouter>
    );

    expect(
        wrapper
            .childAt(0)
            .dive()
            .dive()
            .findWhere(
                node =>
                    node.type() === Link &&
                    node.prop('to') === `/${validItem.url_key}.html`
            )
    ).toHaveLength(2);
});

/**
 * STATE 1: ready
 * `item` is a valid data object
 */
test('renders only the real image', () => {
    const wrapper = shallow(<Item classes={classes} item={validItem} />).dive();
    const image = wrapper.find({ className: classes.image });

    expect(image).toHaveLength(1);
});
