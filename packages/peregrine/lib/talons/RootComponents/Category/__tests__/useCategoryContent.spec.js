import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCategoryContent } from '../useCategoryContent';
import { useLazyQuery } from '@apollo/client';
import { act } from 'react-test-renderer';

import { useAppContext } from '../../../../context/app';

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
        useLazyQuery: jest.fn()
    };
});
const Component = props => {
    const talonprops = useCategoryContent(props);

    return <i {...talonprops} />;
};

const mockProps = {
    categoryId: 3,
    data: {
        category: {
            name: 'Jewelry',
            description: 'Jewelry category'
        },
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
            ]
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

const mockGetFilters = jest.fn();

useLazyQuery.mockReturnValue([
    mockGetFilters,
    { data: mockProductFiltersByCategoryData }
]);

it('returns the proper shape', () => {
    const rendered = createTestInstance(<Component {...mockProps} />);

    const talonProps = rendered.root.findByType('i').props;

    expect(mockGetFilters).toHaveBeenCalled();
    expect(talonProps).toMatchSnapshot();
});

it('sets the filter loading state', () => {
    const rendered = createTestInstance(<Component {...mockProps} />);

    const talonProps = rendered.root.findByType('i').props;

    const { loadFilters, handleLoadFilters } = talonProps;

    expect(loadFilters).toBeFalsy();

    act(() => {
        handleLoadFilters();
    });

    const updatedProps = rendered.root.findByType('i').props;

    expect(updatedProps.loadFilters).toBeTruthy();
});

it('toggles drawer when opening filters', () => {
    const mockToggleDrawer = jest.fn();
    useAppContext.mockReturnValue([
        {},
        {
            toggleDrawer: mockToggleDrawer
        }
    ]);

    const rendered = createTestInstance(<Component {...mockProps} />);

    const talonProps = rendered.root.findByType('i').props;

    const { loadFilters, handleOpenFilters } = talonProps;

    expect(loadFilters).toBeFalsy();

    act(() => {
        handleOpenFilters();
    });

    const updatedProps = rendered.root.findByType('i').props;

    expect(updatedProps.loadFilters).toBeTruthy();
    expect(mockToggleDrawer).toHaveBeenCalled();
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

    const rendered = createTestInstance(<Component {...testProps} />);

    const talonProps = rendered.root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});
