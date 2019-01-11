import React from 'react';
import { shallow } from 'enzyme';

import Section from '../section';

const classes = { text: 'a' };

test('renders with passed icon name', () => {
    const wrapper = shallow(<Section icon="Heart" text="Test" />).dive();

    const icon = wrapper.instance().icon;
    expect(typeof icon).toBe('object');
});

test('renders without icon', () => {
    const wrapper = shallow(<Section classes={classes} text="Test" />).dive();

    const icon = wrapper.instance().icon;
    expect(icon).toBe(null);

    expect(wrapper.find({ className: classes.text }).text()).toEqual('Test');
});
