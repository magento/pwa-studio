import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import MyAccount from '../myAccount';
import Newsletter from '../Newsletter';
import ContactInformation from '../ContactInformation';
import AddressBook from '../AddressBook';

configure({ adapter: new Adapter() });

const classes = {
    root: 'root',
    title: 'title'
};

test('renders correctly', () => {
    const wrapper = shallow(<MyAccount classes={classes} />).dive();

    expect(wrapper.find(`.${classes.title}`).text()).toBe('My Account');
    expect(wrapper.find(ContactInformation)).toHaveLength(1);
    expect(wrapper.find(AddressBook)).toHaveLength(1);
    expect(wrapper.find(Newsletter)).toHaveLength(1);
});
