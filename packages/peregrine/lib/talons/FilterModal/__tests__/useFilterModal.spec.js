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
                    name: 'foo'
                }
            ]
        }
    };
    return {
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
            attribute_code: 'foo',
            label: 'Foo',
            options: [
                {
                    label: 'Bar',
                    value: 'bar'
                }
            ]
        }
    ],
    queries: {
        FILTER_INTROSPECTION: 'FOO'
    }
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
        expect(filterNames.get('foo')).toBeTruthy();
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
