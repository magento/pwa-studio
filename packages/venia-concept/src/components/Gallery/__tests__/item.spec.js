import React from 'react';
import { shallow } from 'enzyme';
import { Link, MemoryRouter } from 'react-router-dom';

import Item from '../item';

const classes = {
    image: 'a',
    images: 'e',
    name: 'g',
    price: 'i',
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
