import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import AddressBlock from '../addressBlock';

configure({ adapter: new Adapter() });

const classes = {
    fullName: 'fullName',
    street: 'street',
    otherAddressInformation: 'otherAddressInformation',
    country: 'country',
    telephone: 'telephone',
    telephoneLink: 'telephoneLink'
};

const firstname = 'Veronica';
const lastname = 'Costello';
const country = 'United States';
const street = ['6146 Honey Bluff Parkway'];
const postcode = '49628-7978';
const telephone = '(555) 229-3326';
const city = 'Calder';
const region = 'Michigan';

test('renders correctly', () => {
    const address = {
        firstname,
        lastname,
        country,
        street,
        postcode,
        telephone,
        city,
        region: {
            region
        }
    };
    const wrapper = shallow(
        <AddressBlock classes={classes} address={address} />
    ).dive();

    expect(wrapper.find(`.${classes.fullName}`).text()).toEqual(
        expect.stringMatching(new RegExp(`${firstname}.*${lastname}`))
    );
    expect(wrapper.find(`.${classes.street}`).text()).toBe(street[0]);
    expect(wrapper.find(`.${classes.otherAddressInformation}`).text()).toEqual(
        expect.stringMatching(new RegExp(`${city}.*${region}.*${postcode}`))
    );
    expect(wrapper.find(`.${classes.country}`).text()).toBe(country);
    expect(wrapper.find(`.${classes.telephoneLink}`).text()).toBe(telephone);
    expect(wrapper.find(`.${classes.telephoneLink}`).prop('href')).toEqual(
        expect.stringContaining(telephone)
    );
});
