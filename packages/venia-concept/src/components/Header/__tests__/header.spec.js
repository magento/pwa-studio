import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Header } from '../header';

configure({ adapter: new Adapter() });

const classes = {
    open: 'open',
    closed: 'closed',
    searchTriggerOpen: 'triggerOpen',
    searchTrigger: 'triggerClosed'
};

test('When icon is clicked, toggle action is called', async () => {
    const searchOpen = false;
    const toggleSearch = jest.fn();
    let wrapper = shallow(
        <Header
            classes={classes}
            toggleSearch={toggleSearch}
            searchOpen={searchOpen}
        />
    );
    const searchButton = wrapper.find('#searchButton');
    wrapper.instance().forceUpdate();
    searchButton.simulate('click');
    expect(toggleSearch.mock.calls).toEqual([[]]); // Has been called
});
