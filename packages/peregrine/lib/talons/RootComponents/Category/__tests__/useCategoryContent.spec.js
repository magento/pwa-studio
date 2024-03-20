import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCategoryContent } from '../useCategoryContent';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

global.STORE_NAME = 'Venia';

jest.mock('../../../../context/app', () => {
    const state = {};
    const api = {
        actions: { toggleDrawer: jest.fn() }
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    return {
        ...apolloClient,
        useLazyQuery: jest.fn(),
        useQuery: jest.fn()
    };
});

const mockProductFiltersByCategoryData = {
    data: {
        products: {
            aggregations: [
                {
                    label: 'Label'
                }
            ]
        }
    }
};

const mockProps = {
    categoryId: 3,
    data: {
        products: {
            page_info: {
                total_pages: 1
            },
            items: [
                {
                    id: 1,
                    name: 'Ring'
                },
                {
                    id: 2,
                    name: 'Necklace'
                }
            ],
            total_count: 2
        }
    }
};

const mockSortData = {
    data: {
        products: {
            sort_fields: {
                options: [
                    {
                        label: 'label',
                        value: 'value'
                    }
                ]
            }
        }
    }
};

const mockCategoryData = {
    categories: {
        items: [
            {
                uid: 'UID',
                name: 'Jewelry',
                url_key: 'jewelry',
                url_path: 'accessories/jewelry',
                description: 'Jewelry category'
            }
        ]
    }
};

const mockGetSortMethods = jest.fn();
const mockGetFilters = jest.fn();

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const Component = props => {
    const talonprops = useCategoryContent(props);

    return <i {...talonprops} />;
};

useQuery.mockReturnValue({ data: mockCategoryData });
describe('useCategoryContent tests', () => {
    it('returns the proper shape', () => {
        useLazyQuery
            .mockReturnValueOnce([
                mockGetFilters,
                mockProductFiltersByCategoryData
            ])
            .mockReturnValueOnce([mockGetSortMethods, mockSortData]);
        const rendered = createTestInstance(<Component {...mockProps} />);

        const talonProps = rendered.root.findByType('i').props;

        expect(mockGetFilters).toHaveBeenCalled();
        expect(mockGetSortMethods).toHaveBeenCalled();
        expect(useQuery).toHaveBeenCalled();
        expect(useLazyQuery).toHaveBeenCalled();
        expect(talonProps).toMatchSnapshot();
    });

    it('handles default category id', () => {
        useLazyQuery
            .mockReturnValueOnce([
                mockGetFilters,
                mockProductFiltersByCategoryData
            ])
            .mockReturnValueOnce([mockGetSortMethods, mockSortData]);
        const testProps = Object.assign({}, mockProps, {
            categoryId: 0
        });

        createTestInstance(<Component {...testProps} />);

        expect(mockGetFilters).not.toHaveBeenCalled();
    });

    it('handles no filter data returned', () => {
        useLazyQuery.mockReturnValue([mockGetFilters, {}]);
        const rendered = createTestInstance(<Component {...mockProps} />);

        const talonProps = rendered.root.findByType('i').props;

        expect(talonProps.filters).toBeNull();
    });

    it('handles no data prop', () => {
        const testProps = {
            categoryId: 0,
            data: null,
            pageSize: 9
        };
        useLazyQuery.mockReturnValue([mockGetFilters, { data: null }]);

        const rendered = createTestInstance(<Component {...testProps} />);

        const talonProps = rendered.root.findByType('i').props;

        expect(talonProps).toMatchSnapshot();
    });

    it('should dispatch page view event', () => {
        const mockDispatchEvent = jest.fn();

        useEventingContext.mockReturnValue([
            {},
            {
                dispatch: mockDispatchEvent
            }
        ]);

        useLazyQuery
            .mockReturnValueOnce([
                mockGetFilters,
                mockProductFiltersByCategoryData
            ])
            .mockReturnValueOnce([mockGetSortMethods, mockSortData]);
        createTestInstance(<Component {...mockProps} />);

        expect(mockDispatchEvent).toBeCalledTimes(1);

        expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
    });
});
