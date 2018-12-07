jest.mock('../../../classify');
import React from 'react';
import wait from 'waait';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import CategoryTile from '../categoryTile';
import CategoryList from '../categoryList';
import getCategoryList from '../../../queries/getCategoryList.graphql';

configure({ adapter: new Adapter() });

const withRouterAndApolloClient = (mocks, renderFn) => (
    <MemoryRouter initialIndex={0} initialEntries={['/']}>
        <MockedProvider mocks={mocks} addTypename={false}>
            {renderFn()}
        </MockedProvider>
    </MemoryRouter>
);

test('displays header', () => {
    const wrapper = mount(
        withRouterAndApolloClient([], () => (
            <CategoryList id={2} title="testing title" />
        ))
    );
    expect(wrapper.find('.header').text()).toEqual('testing title');
});

test('omits header wrapper if header is absent', () => {
    const wrapper = mount(
        withRouterAndApolloClient([], () => <CategoryList id={2} />)
    );
    expect(wrapper.find('.header')).toHaveLength(0);
});

test('displays category tiles', async () => {
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
                                            small_image: 'media/foo-product.jpg'
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
                                            small_image: 'media/bar-product.jpg'
                                        }
                                    ]
                                }
                            },
                            {
                                id: 17,
                                name: 'baz',
                                url_key: 'baz-url.html',
                                url_path: '/bar-url.html',
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
    const wrapper = mount(
        withRouterAndApolloClient(mocks, () => (
            <CategoryList id={2} title="Testing CategoryList" />
        ))
    );
    expect(wrapper.find('.root .fetchingData')).toHaveLength(1);
    await wait(0);
    // expect(wrapper.html()).toBe('lol');
    wrapper.update();
    const tiles = wrapper.find(CategoryTile);
    expect(tiles).toHaveLength(3);
    expect(tiles.find('Link')).toHaveLength(3);
    expect(tiles.at(0).find('img[src$="media/foo.png"]')).toHaveLength(1);
    expect(tiles.at(1).find('img[src$="media/bar-product.jpg"]')).toHaveLength(
        1
    );
    expect(tiles.at(2).find('img')).toHaveLength(0);
});

test('displays zero results', async () => {
    const mocks = [
        {
            request: {
                query: getCategoryList,
                variables: {
                    id: 3
                }
            },
            result: {
                data: {
                    category: {
                        id: 3,
                        children: []
                    }
                }
            }
        }
    ];
    const wrapper = mount(
        withRouterAndApolloClient(mocks, () => <CategoryList id={3} />)
    );
    await wait(0);
    wrapper.update();
    expect(wrapper.find('.root .noResults')).toHaveLength(1);
    expect(wrapper.find(CategoryTile)).toHaveLength(0);
});

test('displays a data fetch error', async () => {
    const mocks = [
        {
            request: {
                query: getCategoryList,
                variables: {
                    id: 4
                }
            },
            error: new Error('Unknown category ID')
        }
    ];
    const wrapper = mount(
        withRouterAndApolloClient(mocks, () => <CategoryList id={4} />)
    );
    await wait(0);
    wrapper.update();
    expect(wrapper.find('.root .fetchError').text()).toMatch(
        /Unknown category ID/
    );
    expect(wrapper.find(CategoryTile)).toHaveLength(0);
});
