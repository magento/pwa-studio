import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { useStoreSwitcher } from '../useStoreSwitcher';
import { mockSetItem } from '../../../util/simplePersistence';
import { act, renderHook } from '@testing-library/react-hooks';
import defaultOperations from '../storeSwitcher.gql';
import { useLocation } from 'react-router-dom';

jest.mock('../../../util/simplePersistence');

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({ pathname: '', search: '' }))
}));

jest.mock('@magento/peregrine', () => ({
    ...jest.requireActual('@magento/peregrine'),
    Util: {
        BrowserPersistence: function() {
            return {
                getItem: jest.fn().mockReturnValueOnce('store2')
            };
        }
    }
}));

jest.mock('@magento/peregrine/lib/hooks/useDropdown', () => ({
    useDropdown: jest.fn().mockReturnValue({
        elementRef: 'elementRef',
        expanded: false,
        setExpanded: jest.fn(),
        triggerRef: jest.fn()
    })
}));

const getStoreConfigDataMock = {
    request: {
        query: defaultOperations.getStoreConfigData
    },
    result: {
        data: {
            storeConfig: {
                store_code: 'store2',
                store_name: 'Store 2',
                store_group_name: 'Group 1'
            }
        }
    }
};

const getRouteDataMocks = (() => {
    const routes = {
        '/': 'venia-new-home',
        '/category/category-name.html': 'category/category-name',
        '/product-name.html': 'localized-product-name.html',
        '/only-store2-category.html': null,
        '/search.html': null
    };
    const result = [];
    Object.entries(routes).forEach(([url, relative_url]) => {
        result.push({
            request: {
                query: defaultOperations.getRouteData,
                variables: {
                    url: url
                }
            },
            result: {
                data: {
                    route: relative_url ? { relative_url: relative_url } : null
                }
            }
        });
    });
    return result;
})();

const getAvailableStoresDataMock = {
    request: {
        query: defaultOperations.getAvailableStoresData
    },
    result: {
        data: {
            availableStores: [
                {
                    locale: 'locale1',
                    store_code: 'store1',
                    store_group_code: 'group1',
                    store_group_name: 'Group 1',
                    store_sort_order: 0,
                    store_name: 'Store 1',
                    default_display_currency_code: 'USD',
                    secure_base_media_url: 'https://example.com/media/'
                },
                {
                    locale: 'locale2',
                    store_code: 'store2',
                    store_group_code: 'group1',
                    store_group_name: 'Group 1',
                    store_sort_order: 1,
                    store_name: 'Store 2',
                    default_display_currency_code: 'EUR',
                    secure_base_media_url:
                        'https://cdn.origin:9000/media/custom/'
                },
                {
                    locale: 'locale3',
                    store_code: 'store3',
                    store_group_code: 'group1',
                    store_group_name: 'Group 1',
                    store_sort_order: 2,
                    store_name: 'Store 3',
                    default_display_currency_code: 'EUR',
                    secure_base_media_url: 'https://example.com/media/'
                },
                {
                    locale: 'locale4',
                    store_code: 'store4',
                    store_group_code: 'group2',
                    store_group_name: 'Group 2',
                    store_sort_order: 0,
                    store_name: 'Store 4',
                    default_display_currency_code: 'EUR',
                    secure_base_media_url: 'https://example.com/media/'
                },
                {
                    locale: 'locale5',
                    store_code: 'store5',
                    store_group_code: 'group2',
                    store_group_name: 'Group 2',
                    store_sort_order: 1,
                    store_name: 'Store 5',
                    default_display_currency_code: 'EUR',
                    secure_base_media_url: 'https://example.com/media/'
                },
                {
                    locale: 'locale6',
                    store_code: 'store6',
                    store_group_code: 'group2',
                    store_group_name: 'Group 2',
                    store_sort_order: 2,
                    store_name: 'Store 6',
                    default_display_currency_code: 'EUR',
                    secure_base_media_url: 'https://example.com/media/'
                }
            ]
        }
    }
};

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = [
        getStoreConfigDataMock,
        ...getRouteDataMocks,
        getAvailableStoresDataMock
    ]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );
    return renderHook(useStoreSwitcher, { wrapper, ...renderHookOptions });
};

const mockWindowLocation = {
    assign: jest.fn()
};

let oldWindowLocation;

beforeEach(() => {
    oldWindowLocation = globalThis.location;
    delete globalThis.location;
    globalThis.location = mockWindowLocation;
    mockWindowLocation.assign.mockClear();
});
afterEach(() => {
    globalThis.location = oldWindowLocation;
});

test('should return correct shape', async () => {
    const { result } = renderHookWithProviders();
    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(result.current).toMatchSnapshot();

    // storeGroups should be a map of the "groups", sorted in sort order.
    expect(result.current.storeGroups.size).toEqual(2);
    expect(result.current.storeGroups.get('group1').length).toEqual(3);
    expect(result.current.storeGroups.get('group2').length).toEqual(3);
});

describe('event handlers', () => {
    const { result } = renderHookWithProviders();

    test('handleSwitchStore switches store view', async () => {
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(mockSetItem.mock.calls).toEqual([
            ['store_view_code', 'store1'],
            ['store_view_currency', 'USD'],
            ['store_view_secure_base_media_url', 'https://example.com/media/']
        ]);
    });

    test('handleSwitchStore does nothing when switching to not existing store', async () => {
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store404');
        });

        expect(mockSetItem).toHaveBeenCalledTimes(0);
    });
});

describe('handleSwitchStore updates url with configured store code', () => {
    beforeEach(() => {
        process.env.USE_STORE_CODE_IN_URL = 'true';
    });
    afterEach(() => {
        delete process.env.USE_STORE_CODE_IN_URL;
    });

    test('switching stores on the homepage', async () => {
        useLocation.mockReturnValue({
            pathname: '/',
            search: ''
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(globalThis.location.assign).toBeCalledWith('/store1');
    });

    test('switching store updates url with params', async () => {
        useLocation.mockReturnValue({
            pathname: '/category/category-name.html',
            search: '?page=1'
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(globalThis.location.assign).toBeCalledWith(
            '/store1/category/category-name?page=1'
        );
    });

    test('switching store updates url without params', async () => {
        useLocation.mockReturnValue({
            pathname: '/product-name.html',
            search: ''
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(globalThis.location.assign).toBeCalledWith(
            '/store1/localized-product-name.html'
        );
    });

    test('switching store when page is not exists in the new store', async () => {
        useLocation.mockReturnValue({
            pathname: '/only-store2-category.html',
            search: '?page=1'
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        //When url is not available on the new store navigate to homepage
        expect(globalThis.location.assign).toBeCalledWith('/store1');
    });

    test('switching store when pathname is internal route', async () => {
        useLocation.mockReturnValue({
            pathname: '/search.html',
            search: '?query=test&page=1'
        });
        const { result } = renderHookWithProviders({
            renderHookOptions: {
                initialProps: {
                    availableRoutes: [
                        {
                            exact: true,
                            name: 'Search',
                            path: '../../RootComponents/Search',
                            pattern: '/search.html'
                        }
                    ]
                }
            }
        });

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(globalThis.location.assign).toBeCalledWith(
            '/store1/search.html?query=test&page=1'
        );
    });
});

describe('handleSwitchStore updates url with store code not configured', () => {
    beforeEach(() => {
        process.env.USE_STORE_CODE_IN_URL = 'false';
    });
    afterEach(() => {
        delete process.env.USE_STORE_CODE_IN_URL;
    });

    test('switching stores on the homepage and path is empty', async () => {
        useLocation.mockReturnValue({
            pathname: '/',
            search: ''
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(globalThis.location.assign).toBeCalledWith('/');
    });

    test('switching store updates url with params', async () => {
        useLocation.mockReturnValue({
            pathname: '/category/category-name.html',
            search: '?page=1'
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(globalThis.location.assign).toBeCalledWith(
            '/category/category-name?page=1'
        );
    });

    test('switching store updates url without params', async () => {
        useLocation.mockReturnValue({
            pathname: '/product-name.html',
            search: ''
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(globalThis.location.assign).toBeCalledWith(
            '/localized-product-name.html'
        );
    });

    test('switching store when page is not exists in the new store', async () => {
        useLocation.mockReturnValue({
            pathname: '/only-store2-category.html',
            search: '?page=1'
        });
        const { result } = renderHookWithProviders();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        //When url is not available on the new store navigate to homepage
        expect(globalThis.location.assign).toBeCalledWith('/');
    });

    test('switching store when pathname is internal route', async () => {
        useLocation.mockReturnValue({
            pathname: '/search.html',
            search: '?query=test&page=1'
        });
        const { result } = renderHookWithProviders({
            renderHookOptions: {
                initialProps: {
                    availableRoutes: [
                        {
                            exact: true,
                            name: 'Search',
                            path: '../../RootComponents/Search',
                            pattern: '/search.html'
                        }
                    ]
                }
            }
        });

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            await result.current.handleSwitchStore('store1');
        });

        expect(globalThis.location.assign).toBeCalledWith(
            '/search.html?query=test&page=1'
        );
    });
});
