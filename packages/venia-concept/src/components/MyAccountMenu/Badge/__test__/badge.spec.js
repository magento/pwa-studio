import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Badge from '../badge';

configure({ adapter: new Adapter() });

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
