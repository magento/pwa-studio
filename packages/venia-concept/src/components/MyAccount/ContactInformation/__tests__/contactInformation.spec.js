import React from 'react';
import { shallow } from 'enzyme';
import ContactInformation from '../contactInformation';

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
