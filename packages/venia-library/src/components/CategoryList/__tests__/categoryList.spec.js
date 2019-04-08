import React from 'react';
import waitForExpect from 'wait-for-expect';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';

import LoadingIndicator from 'src/components/LoadingIndicator';
import CategoryTile from '../categoryTile';
import CategoryList from '../categoryList';
import getCategoryList from '../../../queries/getCategoryList.graphql';

jest.mock('src/classify');

const withRouterAndApolloClient = (mocks, renderFn) => (
    <MemoryRouter initialIndex={0} initialEntries={['/']}>
        <MockedProvider mocks={mocks} addTypename={false}>
            {renderFn()}
        </MockedProvider>
    </MemoryRouter>
);

test('renders a header', () => {
    const title = 'foo';
    const { root } = TestRenderer.create(
        withRouterAndApolloClient([], () => (
            <CategoryList id={2} title={title} />
        ))
    );

    const list = root.findByProps({ className: 'root' });
    const header = list.findByProps({ className: 'header' });

    expect(header).toBeTruthy();
    expect(header.findByProps({ children: title })).toBeTruthy();
});

test('omits the header if there is no title', () => {
    const { root } = TestRenderer.create(
        withRouterAndApolloClient([], () => <CategoryList id={2} />)
    );

    expect(root.findAllByProps({ className: 'header' })).toHaveLength(0);
});

test('renders category tiles', async () => {
    const mocks = [
        {
            request: {
                query: getCategoryList,
                variables: {
                    id: 2
                }
            },
            result: {
                data: {
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
                }
            }
        }
    ];

    const { root } = TestRenderer.create(
        withRouterAndApolloClient(mocks, () => (
            <CategoryList id={2} title="foo" />
        ))
    );

    expect(root.findByType(LoadingIndicator)).toBeTruthy();

    await waitForExpect(() => {
        expect(root.findAllByType(CategoryTile)).toHaveLength(3);
    });
});
