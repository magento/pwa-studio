import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Items, { emptyData } from '../items';

configure({ adapter: new Adapter() });

const items = [
    {
        id: 1,
        name: 'Test Product 1',
        small_image: '/test/product/1.png',
        price: {
            regularPrice: {
                amount: {
                    value: 100
                }
            }
        }
    },
    {
        id: 2,
        name: 'Test Product 2',
        small_image: '/test/product/2.png',
        price: {
            regularPrice: {
                amount: {
                    value: 100
                }
            }
        }
    }
];
// no render tests for now, since enzyme doesn't support React Fragment yet
// see https://github.com/airbnb/enzyme/issues/1213

test('emptyData contains only nulls', () => {
    expect(emptyData.every(v => v === null)).toBe(true);
});

test.skip('has initial state', () => {
    const wrapper = shallow(<Items items={[]} />);

    expect(wrapper.state('collection')).toMatchObject(
        expect.objectContaining({ next: expect.any(Function) })
    );
    expect(wrapper.state('done')).toBe(false);
});

test.skip('updates state after receiving props', () => {
    const wrapper = shallow(<Items items={[]} />);
    const prevCollection = wrapper.state('collection');
    const nextCollection = wrapper.setProps({ items: [] }).state('collection');

    expect(nextCollection).not.toBe(prevCollection);
    expect(nextCollection).toMatchObject(
        expect.objectContaining({ next: expect.any(Function) })
    );
    expect(wrapper.state('done')).toBe(false);
});

test.skip('updates state after observer terminates', () => {
    const wrapper = shallow(<Items items={items} />);

    items.forEach(() => {
        expect(wrapper.state('done')).toBe(false);
        wrapper.instance().handleLoad('');
    });

    expect(wrapper.state('done')).toBe(true);
});

test.skip('updates state even when handling errors', () => {
    const wrapper = shallow(<Items items={items} />);

    items.forEach(() => {
        expect(wrapper.state('done')).toBe(false);
        wrapper.instance().handleError('');
    });

    expect(wrapper.state('done')).toBe(true);
});
