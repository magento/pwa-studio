/* Deprecated in PWA-12.1.0*/

import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import LoadingIndicator from '../../LoadingIndicator';
import CategoryTile from '../categoryTile';
import CategoryList from '../categoryList';
import { useCategoryList } from '@magento/peregrine/lib/talons/CategoryList/useCategoryList';
import { useCategoryTile } from '@magento/peregrine/lib/talons/CategoryList/useCategoryTile';

jest.mock('react-router-dom', () => ({
    Link: props => <mock-Link {...props} />
}));
jest.mock('../../../classify');
jest.mock('@magento/peregrine/lib/talons/CategoryList/useCategoryTile', () => {
    return {
        useCategoryTile: jest.fn()
    };
});

jest.mock('@magento/peregrine/lib/talons/CategoryList/useCategoryList', () => {
    return {
        useCategoryList: jest.fn()
    };
});

useCategoryTile.mockReturnValue({
    image: {},
    item: {}
});

useCategoryList.mockReturnValue({
    data: {
        category: {
            children: []
        }
    },
    loading: false,
    error: false
});

test('renders a header', () => {
    const title = 'foo';
    const { root } = createTestInstance(<CategoryList id={2} title={title} />);

    const list = root.findByProps({ className: 'root' });
    const header = list.findByProps({ className: 'header' });

    expect(header).toBeTruthy();
    expect(header.findByProps({ children: title })).toBeTruthy();
});

test('omits the header if there is no title', () => {
    const { root } = createTestInstance(<CategoryList id={2} />);

    expect(root.findAllByProps({ className: 'header' })).toHaveLength(0);
});

test('renders a loading indicator', () => {
    useCategoryList.mockReturnValueOnce({
        loading: true
    });

    const { root } = createTestInstance(<CategoryList id={2} title="foo" />);

    expect(root.findAllByType(LoadingIndicator)).toBeTruthy();
});

test('renders category tiles', () => {
    const data = {
        category: {
            id: 2,
            children: [
                {
                    id: 15,
                    name: 'foo',
                    url_key: 'foo-url.html',
                    url_path: '/foo-url.html',
                    children_count: 0,
                    path: '1/2/15',
                    image: 'media/foo.png',
                    productImagePreview: {
                        items: [
                            {
                                small_image: {
                                    url: 'media/foo-product.jpg'
                                }
                            }
                        ]
                    }
                },
                {
                    id: 16,
                    name: 'bar',
                    url_key: 'bar-url.html',
                    url_path: '/bar-url.html',
                    children_count: 0,
                    path: '1/2/16',
                    image: null,
                    productImagePreview: {
                        items: [
                            {
                                small_image: {
                                    url: 'media/bar-product.jpg'
                                }
                            }
                        ]
                    }
                },
                {
                    id: 17,
                    name: 'baz',
                    url_key: 'baz-url.html',
                    url_path: '/baz-url.html',
                    children_count: 0,
                    path: '1/2/17',
                    image: null,
                    productImagePreview: {
                        items: []
                    }
                }
            ]
        }
    };

    useCategoryList.mockReturnValueOnce({
        childCategories: data.category.children
    });

    const { root } = createTestInstance(<CategoryList id={2} title="foo" />);

    expect(root.findAllByType(CategoryTile)).toHaveLength(3);
});
