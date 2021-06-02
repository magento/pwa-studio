import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCategoryContent } from '../useCategoryContent';
import { useLazyQuery, useQuery } from '@apollo/client';

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
const Component = props => {
    const talonprops = useCategoryContent(props);

    return <i {...talonprops} />;
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

const mockProductFiltersByCategoryData = {
    products: {
        aggregations: [
            {
                label: 'Label'
            }
        ]
    }
};
const mockCategoryData = {
    category: {
        name: 'Jewelry',
        description: 'Jewelry category'
    }
};

const mockGetFilters = jest.fn();

useLazyQuery.mockReturnValue([
    mockGetFilters,
    { data: mockProductFiltersByCategoryData }
]);

useQuery.mockReturnValue({ data: mockCategoryData });

it('returns the proper shape', () => {
    const rendered = createTestInstance(<Component {...mockProps} />);

    const talonProps = rendered.root.findByType('i').props;

    expect(mockGetFilters).toHaveBeenCalled();
    expect(useQuery).toHaveBeenCalled();
    expect(talonProps).toMatchSnapshot();
});

it('handles default category id', () => {
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
