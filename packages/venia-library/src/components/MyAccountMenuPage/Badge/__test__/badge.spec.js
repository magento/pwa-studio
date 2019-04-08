import React from 'react';
import { shallow } from 'enzyme';
import Badge from '../badge';

const classes = {
    root: 'root',
    text: 'text'
};

const badgeText = 'new';

test('renders correctly', () => {
    const wrapper = shallow(
        <Badge classes={classes}>{badgeText}</Badge>
    ).dive();

    expect(wrapper.find(`.${classes.text}`).text()).toBe(badgeText);
});
