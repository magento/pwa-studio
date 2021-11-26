import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useHistory, useLocation } from 'react-router-dom';

import { createTestInstance } from '@magento/peregrine';
import { useFilterModal } from '../useFilterModal';

jest.mock('../helpers', () => ({
    getStateFromSearch: jest.fn(() => ({})),
    getSearchFromState: jest.fn(() => 'searchFromState'),
    stripHtml: jest.fn(() => 'strippedHtml')
}));

jest.mock('@magento/peregrine/lib/context/app', () => {
    const api = {
        closeDrawer: jest.fn()
    };
    const state = {
        drawer: 'filter'
    };
    return {
        useAppContext: jest.fn(() => [state, api])
    };
});

jest.mock('../useFilterState', () => {
    const api = {
        setItems: jest.fn()
    };
    const state = {};
    return {
        useFilterState: jest.fn(() => [state, api])
    };
});

// Mock introspection to return all the filters from the test data
jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const introspectionData = {
        __type: {
            inputFields: [
                {
                    name: 'price'
                },
                {
                    name: 'category_id'
                },
                {
                    name: 'foo1'
                },
                {
                    name: 'foo2'
                },
                {
                    name: 'foo3'
                },
                {
                    name: 'foo4'
                },
                {
                    name: 'foo5'
                },
                {
                    name: 'foo6'
                },
                {
                    name: 'foo7'
                }
            ]
        }
    };
    return {
        ...apolloClient,
        useQuery: jest.fn(() => ({ data: introspectionData, error: null }))
    };
});

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({ push: jest.fn() })),
    useLocation: jest.fn(() => ({ pathname: '', search: '' }))
}));
const mockPush = jest.fn();
useHistory.mockImplementation(() => ({ push: mockPush }));

const defaultProps = {
    filters: [
        {
            attribute_code: 'price',
            label: 'Price',
            position: 1,
            options: [
                {
                    label: '*-100',
                    value: '*_100'
                }
            ]
        },
        {
            attribute_code: 'category_id',
            label: 'Category',
            position: 2,
            options: [
                {
                    label: 'Bottoms',
                    value: '28'
                },
                {
                    label: 'Tops',
                    value: '19'
                }
            ]
        },
        {
            attribute_code: 'foo1',
            label: 'Foo 1',
            position: null,
            options: [
                {
                    label: 'Bar 1',
                    value: 'bar 1'
                }
            ]
        },
        {
            attribute_code: 'foo2',
            label: 'Foo 2',
            position: 0,
            options: [
                {
                    label: 'Bar 2',
                    value: 'bar 2'
                }
            ]
        },
        {
            attribute_code: 'foo3',
            label: 'Foo 3',
            position: 1,
            options: [
                {
                    label: 'Bar 3',
                    value: 'bar 3'
                }
            ]
        },
        {
            attribute_code: 'foo4',
            label: 'Foo 4',
            position: 10,
            options: [
                {
                    label: 'Bar 4',
                    value: 'bar 4'
                }
            ]
        },
        {
            attribute_code: 'foo5',
            label: 'Foo 5',
            position: 9,
            options: [
                {
                    label: 'Bar 5',
                    value: 'bar 5'
                }
            ]
        },
        {
            attribute_code: 'foo6',
            label: null,
            position: null,
            options: [
                {
                    label: 'Bar 6',
                    value: 'bar 6'
                }
            ]
        },
        {
            attribute_code: 'foo7',
            label: 'Foo 7',
            position: 7,
            options: [
                {
                    label: 'Bar 7',
                    value: 'bar 7'
                }
            ]
        }
    ],
    operations: {}
};
const log = jest.fn();

const Component = () => {
    const talonProps = useFilterModal(defaultProps);

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};
describe('#useFilterModal', () => {
    beforeEach(() => {
        log.mockClear();
        mockPush.mockClear();
    });

    it('returns expected shape', () => {
        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith({
            filterApi: expect.any(Object),
            filterItems: expect.any(Object),
            filterKeys: expect.any(Object),
            filterNames: expect.any(Object),
            filterState: expect.any(Object),
            handleApply: expect.any(Function),
            handleClose: expect.any(Function),
            handleKeyDownActions: expect.any(Function),
            handleOpen: expect.any(Function),
            handleReset: expect.any(Function),
            isApplying: expect.any(Boolean),
            isOpen: expect.any(Boolean)
        });
    });

    it('enables category_id filter on search page', () => {
        useLocation.mockReturnValueOnce({
            pathname: '/search.html'
        });
        createTestInstance(<Component />);
        const { filterNames } = log.mock.calls[0][0];
        expect(filterNames.get('category_id')).toBeTruthy();
    });

    it('only renders filters that are valid and enabled', () => {
        createTestInstance(<Component />);
        const { filterNames } = log.mock.calls[0][0];
        expect(filterNames).toMatchInlineSnapshot(`
            Map {
              "price" => "Price",
              "foo1" => "Foo 1",
              "foo2" => "Foo 2",
              "foo3" => "Foo 3",
              "foo7" => "Foo 7",
              "foo5" => "Foo 5",
              "foo4" => "Foo 4",
              "foo6" => null,
            }
        `);
    });

    it('writes filter state to history when "isApplying"', () => {
        createTestInstance(<Component />);
        const { handleApply } = log.mock.calls[0][0];

        act(() => {
            handleApply();
        });
        expect(mockPush).toHaveBeenCalled();
    });
});
