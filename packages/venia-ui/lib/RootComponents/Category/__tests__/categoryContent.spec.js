import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import CategoryContent from '../categoryContent';

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);
    return { useAppContext };
});

jest.mock('../../../components/Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    Title: () => 'Title'
}));

jest.mock('../../../components/Gallery', () => 'Gallery');
jest.mock('../../../components/Pagination', () => 'Pagination');

const classes = {
    root: 'a',
    title: 'b',
    gallery: 'c',
    pagination: 'd'
};

const data = {
    category: {
        name: 'Name',
        description: 'test'
    },
    products: {
        items: {
            id: 1
        }
    }
};

test('renders the correct tree', () => {
    const instance = createTestInstance(
        <CategoryContent
            pageControl={{}}
            data={data}
            pageSize={6}
            classes={classes}
        />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
