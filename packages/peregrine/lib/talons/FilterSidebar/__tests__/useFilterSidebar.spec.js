import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useHistory, useLocation } from 'react-router-dom';

import { createTestInstance } from '@magento/peregrine';
import { useFilterSidebar } from '../useFilterSidebar';

jest.mock('../../FilterModal/helpers', () => ({
    getStateFromSearch: jest.fn(() => ({})),
    getSearchFromState: jest.fn(() => 'searchFromState'),
    sortFiltersArray: jest.fn(props => props),
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

jest.mock('../../FilterModal/useFilterState', () => {
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
                    name: 'category_uid'
                },
                {
                    name: 'foo'
                },
                {
                    name: 'boolean_filter'
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
            attribute_code: 'category_uid',
            label: 'Category 2',
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
            attribute_code: 'foo',
            label: 'Foo',
            options: [
                {
                    label: 'Bar',
                    value: 'bar'
                }
            ]
        },
        {
            attribute_code: 'boolean_filter',
            label: 'Boolean Filter',
            options: [
                {
                    __typename: 'AggregationOption',
                    label: '0',
                    value: '0'
                },
                {
                    __typename: 'AggregationOption',
                    label: '1',
                    value: '1'
                }
            ]
        }
    ],
    operations: {}
};
const log = jest.fn();

const Component = () => {
    const talonProps = useFilterSidebar(defaultProps);

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};
describe('#useFilterSidebar', () => {
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
            filterFrontendInput: expect.any(Object),
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
        expect(filterNames.get('category_uid')).toBeTruthy();
    });

    it('only renders filters that are valid and enabled', () => {
        createTestInstance(<Component />);
        const { filterNames } = log.mock.calls[0][0];
        expect(filterNames.get('foo')).toBeTruthy();
        expect(filterNames.get('category_id')).toBeFalsy();
        expect(filterNames.get('category_uid')).toBeFalsy();
    });

    it('writes filter state to history when "isApplying"', () => {
        createTestInstance(<Component />);
        const { handleApply } = log.mock.calls[0][0];

        act(() => {
            handleApply();
        });
        expect(mockPush).toHaveBeenCalled();
    });

    it('renders boolean filters', () => {
        createTestInstance(<Component />);
        const { filterNames } = log.mock.calls[0][0];
        expect(filterNames.get('boolean_filter')).toBeTruthy();
    });
});
