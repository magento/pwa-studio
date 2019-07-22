import React from 'react';
import { shallow } from 'enzyme';

import { Item } from '../index.js';

const classes = {
    root: 'abc'
};

test('renders a div by default', () => {
    const props = { item: 'a', itemIndex: 1 };
    const wrapper = shallow(<Item {...props} />).dive();

    expect(wrapper.type()).toEqual('div');
});

test('renders a provided tagname', () => {
    const props = { item: 'a', render: 'p', itemIndex: 1 };
    const wrapper = shallow(<Item {...props} />).dive();

    expect(wrapper.type()).toEqual('p');
});

test('renders a provided component', () => {
    const Span = () => <span />;
    const props = { item: 'a', render: Span, itemIndex: 1 };
    const wrapper = shallow(<Item {...props} />);

    expect(wrapper.type()).toEqual(Span);
    expect(wrapper.dive().type()).toEqual('span');
});

test('passes only rest props to basic `render`', () => {
    const props = { classes, item: 'a', render: 'p', itemIndex: 1 };
    const wrapper = shallow(<Item {...props} data-id="b" />).dive();

    expect(wrapper.props()).toHaveProperty('data-id');
    expect(wrapper.props()).not.toHaveProperty('classes');
    expect(wrapper.props()).not.toHaveProperty('hasFocus');
    expect(wrapper.props()).not.toHaveProperty('isSelected');
    expect(wrapper.props()).not.toHaveProperty('item');
    expect(wrapper.props()).not.toHaveProperty('render');
});

test('passes custom and rest props to composite `render`', () => {
    const Span = () => <span />;
    const itemIndex = 1;
    const props = { classes, item: 'a', render: Span, itemIndex };
    const wrapper = shallow(<Item {...props} data-id="b" />);

    expect(wrapper.props()).toHaveProperty('data-id');
    expect(wrapper.props()).toHaveProperty('classes');
    expect(wrapper.props()).toHaveProperty('hasFocus');
    expect(wrapper.props()).toHaveProperty('isSelected');
    expect(wrapper.props()).toHaveProperty('item');
    expect(wrapper.props()).toHaveProperty('itemIndex');
    expect(wrapper.prop('itemIndex')).toBe(itemIndex);
    expect(wrapper.props()).not.toHaveProperty('render');
});

test('passes `item` as `children` if `item` is a string', () => {
    const props = { item: 'a', render: 'p', itemIndex: 1 };
    const wrapper = shallow(<Item {...props} />).dive();

    expect(wrapper.text()).toEqual('a');
});

test('does not pass `children` if `item` is not a string', () => {
    const props = { item: { id: 1 }, render: 'p', itemIndex: 1 };
    const wrapper = shallow(<Item {...props} />).dive();

    expect(wrapper.text()).toBe('');
});
