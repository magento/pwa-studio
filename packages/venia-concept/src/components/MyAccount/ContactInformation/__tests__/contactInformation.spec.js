import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ContactInformation from '../contactInformation';

configure({ adapter: new Adapter() });

const classes = {
    fullName: 'fullName',
    email: 'email'
};

const firstname = 'Veronica';
const lastname = 'Costello';
const email = 'roni_cost@example.com';

const user = {
    firstname,
    lastname,
    email,
    extension_attributes: {
        is_subscribed: false
    }
};

test('renders correctly', () => {
    const wrapper = shallow(
        <ContactInformation classes={classes} user={user} />
    ).dive();

    expect(wrapper.find(`.${classes.fullName}`).text()).toEqual(
        expect.stringMatching(new RegExp(`${firstname}.*${lastname}`))
    );
    expect(wrapper.find(`.${classes.email}`).text()).toBe(email);
});
