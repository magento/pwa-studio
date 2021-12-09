import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Header from '../header';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import { useQuery } from '@apollo/client';

jest.mock('../../../classify');
jest.mock('../../Logo', () => 'Logo');
jest.mock('../accountTrigger', () => 'AccountTrigger');
jest.mock('../cartTrigger', () => 'CartTrigger');
jest.mock('../navTrigger', () => 'NavTrigger');
jest.mock('../searchTrigger', () => 'SearchTrigger');
jest.mock('../onlineIndicator', () => 'OnlineIndicator');
jest.mock('../storeSwitcher', () => 'StoreSwitcher');
jest.mock('../currencySwitcher', () => 'CurrencySwitcher');
jest.mock('../../MegaMenu', () => 'MegaMenu');
jest.mock('../../PageLoadingIndicator', () => () => (
    <div id={'pageLoadingIndicator'} />
));

jest.mock('@magento/peregrine/lib/util/makeUrl');

jest.mock('@magento/peregrine/lib/talons/Header/useHeader', () => {
    const state = {
        handleSearchTriggerClick: jest.fn(),
        hasBeenOffline: false,
        isOnline: true,
        isPageLoading: false,
        searchOpen: false
    };
    return {
        useHeader: jest.fn(() => state)
    };
});

jest.mock('react-router-dom', () => ({
    Link: jest.fn(() => null),
    Route: jest.fn(() => null),
    useLocation: jest.fn(() => ({ pathname: '/test.html' }))
}));

jest.mock('@apollo/client');

beforeAll(() => {
    useQuery.mockReturnValue({
        data: {
            categoryList: [
                {
                    id: 2,
                    name: 'Default Category',
                    children: [
                        {
                            id: 3,
                            include_in_menu: 1,
                            name: 'Accessories',
                            position: 4,
                            url_path: 'venia-accessories',
                            children: [
                                {
                                    id: 4,
                                    include_in_menu: 1,
                                    name: 'Belts',
                                    position: 10,
                                    url_path: 'venia-accessories/venia-belts',
                                    children: []
                                }
                            ]
                        },
                        {
                            id: 13,
                            include_in_menu: 0,
                            name: 'Dresses',
                            position: 3,
                            url_path: 'venia-dresses',
                            children: []
                        }
                    ]
                }
            ],
            storeConfig: {
                store_code: 'default',
                category_url_suffix: '.html'
            }
        }
    });
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
            isPageLoading: true,
            searchOpen: false
        };
    });

    const component = createTestInstance(<Header />);
    component.root.findByProps({ id: 'pageLoadingIndicator' });
});
