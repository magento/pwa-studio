import React, { Fragment } from 'react';
import { shallow } from 'enzyme';

import List from '..';

const classes = {
    root: 'abc'
};

const items = [
    {
        id: '001',
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
        id: '002',
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

test('renders a div by default', () => {
    const props = { classes };
    const wrapper = shallow(<List {...props} />).dive();

    expect(wrapper.type()).toEqual('div');
    expect(wrapper.prop('className')).toEqual(classes.root);
});

test('renders a provided tagname', () => {
    const props = { classes, render: 'ul' };
    const wrapper = shallow(<List {...props} />).dive();

    expect(wrapper.type()).toEqual('ul');
    expect(wrapper.prop('className')).toEqual(classes.root);
});

test('renders a provided component', () => {
    const Nav = () => <nav />;
    const props = { render: Nav };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper.type()).toEqual(Nav);
    expect(wrapper.dive().type()).toEqual('nav');
});

test('passes only rest props to basic `render`', () => {
    const props = { classes, items, render: 'ul', renderItem: 'li' };
    const wrapper = shallow(<List {...props} data-id="b" />).dive();

    expect(wrapper.props()).toHaveProperty('data-id');
    expect(wrapper.props()).not.toHaveProperty('classes');
    expect(wrapper.props()).not.toHaveProperty('items');
    expect(wrapper.props()).not.toHaveProperty('onSelectionChange');
    expect(wrapper.props()).not.toHaveProperty('selectionModel');
    expect(wrapper.props()).not.toHaveProperty('render');
    expect(wrapper.props()).not.toHaveProperty('renderItem');
});

test('passes custom and rest props to composite `render`', () => {
    const Nav = () => <nav />;
    const props = { classes, items, render: Nav, renderItem: 'a' };
    const wrapper = shallow(<List {...props} data-id="b" />);

    expect(wrapper.props()).toHaveProperty('data-id');
    expect(wrapper.props()).toHaveProperty('classes');
    expect(wrapper.props()).toHaveProperty('items');
    expect(wrapper.props()).toHaveProperty('onSelectionChange');
    expect(wrapper.props()).toHaveProperty('selectionModel');
    expect(wrapper.props()).not.toHaveProperty('render');
    expect(wrapper.props()).not.toHaveProperty('renderItem');
});

test('renders a fragment as `children`', () => {
    const props = { classes, items };
    const wrapper = shallow(<List {...props} />);

    expect(
        wrapper
            .childAt(0)
            .dive()
            .type()
    ).toEqual(Fragment);
});

test('passes correct props through to `Items`', () => {
    const Item = () => <li />;
    const selectionModel = 'checkbox';
    const props = { items, renderItem: Item, selectionModel };
    const wrapper = shallow(<List {...props} />);

    expect(wrapper.childAt(0).props()).toMatchObject(props);
});

test('calls `onSelectionChange` on selection change', () => {
    const onSelectionChange = jest.fn();
    const selection = new Set();
    const props = { items, onSelectionChange };
    const wrapper = shallow(<List {...props} />);

    wrapper.instance().handleSelectionChange(selection);
    expect(onSelectionChange).toHaveBeenCalledWith(selection);
});

test('does not throw if `onSelectionChange` is not provided', () => {
    const selection = new Set();
    const props = { items };
    const wrapper = shallow(<List {...props} />);

    const cb = () => wrapper.instance().handleSelectionChange(selection);
    expect(cb).not.toThrow();
});
