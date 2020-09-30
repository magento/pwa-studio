import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import Category from '../category';

jest.mock('@magento/peregrine/lib/talons/RootComponents/Category', () => ({
    useCategory: jest.fn().mockReturnValue({
        data: {
            products: {
                page_info: {
                    total_pages: 6
                }
            }
        },
        error: null,
        loading: false,
        pageControl: {
            currentPage: 3,
            setPage: jest.fn(),
            totalPages: 6
        },
        sortProps: [
            {
                sortText: 'Best Match',
                sortAttribute: 'relevance',
                sortDirection: 'DESC'
            },
            jest.fn()
        ],
        totalPagesFromData: 6
    })
}));

jest.mock('../../../components/Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    Title: () => 'Title',
    Meta: () => 'Meta'
}));

jest.mock('../categoryContent', () => 'CategoryContent');

const categoryProps = {
    id: 3,
    pageSize: 6
};
const tree = createTestInstance(<Category {...categoryProps} />);

test('renders the correct tree', () => {
    expect(tree.toJSON()).toMatchSnapshot();
});
