import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Header from '../header';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';

jest.mock('../../../classify');
jest.mock('../../Logo', () => 'Logo');
jest.mock('../accountTrigger', () => 'AccountTrigger');
jest.mock('../cartTrigger', () => 'CartTrigger');
jest.mock('../navTrigger', () => 'NavTrigger');
jest.mock('../searchTrigger', () => 'SearchTrigger');
jest.mock('../onlineIndicator', () => 'OnlineIndicator');
jest.mock('../../PageLoadingIndicator', () => () => (
    <div id={'pageLoadingIndicator'} />
));

jest.mock('@magento/venia-drivers', () => ({
    resourceUrl: jest.fn(url => url),
    Link: jest.fn(() => null),
    Route: jest.fn(() => null)
}));

jest.mock('@magento/peregrine/lib/talons/Header/useHeader', () => {
    const state = {
        handleSearchTriggerClick: jest.fn(),
        hasBeenOffline: false,
        isOnline: true,
        searchOpen: false,
        isPageLoading: false
    };
    return {
        useHeader: jest.fn(() => state)
    };
});

test('verify Header can render in default state', () => {
    const component = createTestInstance(<Header />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('verify PageLoadingIndicator is displayed when page is loading', () => {
    useHeader.mockImplementation(() => {
        return {
            handleSearchTriggerClick: jest.fn(),
            hasBeenOffline: false,
            isOnline: true,
            searchOpen: false,
            isPageLoading: true
        };
    });

    const component = createTestInstance(<Header />);
    component.root.findByProps({ id: 'pageLoadingIndicator' });
});
