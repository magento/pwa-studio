import React from 'react';
import { shallow } from 'enzyme';
import Navigation from '../navigation';
import { MyAccountMenuTrigger } from 'src/components/MyAccountMenuPage';

test('getUserDetails() should be called when navigation component mounts', async () => {
    const getUserDetails = jest.fn();
    const getAllCategories = jest.fn();

    const wrapper = shallow(
        <Navigation
            getUserDetails={getUserDetails}
            getAllCategories={getAllCategories}
        />
    ).dive();

    wrapper.update();

    expect(getUserDetails).toHaveBeenCalledTimes(1);
});

test('Navigation footer should show the "Sign In" button if user is not signed in.', async () => {
    const getUserDetails = jest.fn();
    const getAllCategories = jest.fn();

    const classes = { authBar: 'authBar' };

    const wrapper = shallow(
        <Navigation
            getUserDetails={getUserDetails}
            getAllCategories={getAllCategories}
            isSignedIn={false}
            classes={classes}
        />
    ).dive();

    const navFooter = wrapper.find('div.authBar');
    expect(navFooter.exists()).toBeTruthy();
});

test('Navigation footer should not show the "Sign In" button if user is signed in.', async () => {
    const getUserDetails = jest.fn();
    const getAllCategories = jest.fn();

    const classes = { authBar: 'authBar' };

    const wrapper = shallow(
        <Navigation
            getUserDetails={getUserDetails}
            getAllCategories={getAllCategories}
            isSignedIn={true}
            classes={classes}
        />
    ).dive();

    const navFooter = wrapper.find('div.authBar');
    expect(navFooter.exists()).toBeFalsy();
});

test('Navigation footer should not show user details element if user is not signed in.', async () => {
    const getUserDetails = jest.fn();
    const getAllCategories = jest.fn();

    const classes = { userChip: 'userChip' };

    const wrapper = shallow(
        <Navigation
            getUserDetails={getUserDetails}
            getAllCategories={getAllCategories}
            isSignedIn={false}
            classes={classes}
        />
    ).dive();

    const myAccountMenuTrigger = wrapper.find(MyAccountMenuTrigger);
    expect(myAccountMenuTrigger.exists()).toBeFalsy();
});

test('Navigation footer should show user details element if user is signed in.', async () => {
    const getUserDetails = jest.fn();
    const getAllCategories = jest.fn();

    const classes = { userChip: 'userChip' };

    const wrapper = shallow(
        <Navigation
            getUserDetails={getUserDetails}
            getAllCategories={getAllCategories}
            isSignedIn={true}
            classes={classes}
        />
    ).dive();

    const myAccountMenuTrigger = wrapper.find(MyAccountMenuTrigger);
    expect(myAccountMenuTrigger.exists()).toBeTruthy();
});
