import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import navigationMenuQuery from '../../../queries/getNavigationMenu.graphql';
import { MockedProvider } from 'react-apollo/test-utils';
import CategoryMenu from '../categoryMenu';

configure({ adapter: new Adapter() });

jest.mock('react-router-dom/Link', () => () => <h6>link</h6>);
jest.mock('react-router-dom/NavLink', () => 'navlink');

const mocks = [
    {
        request: {
            query: navigationMenuQuery,
            variables: {
                id: 1
            }
        },
        result: {
            data: {
                category: {
                    id: 1,
                    name: 'Parent Category',
                    product_count: 0,
                    path: '1',
                    children: [
                        {
                            id: 2,
                            name: 'Child Category 1',
                            position: 1,
                            level: 1,
                            url_key: 'child-1',
                            url_path: 'test-category/child-1',
                            product_count: 5,
                            children_count: '2',
                            path: '1/2'
                        },
                        {
                            id: 3,
                            name: 'Child Category 2',
                            position: 2,
                            level: 1,
                            url_key: 'child-2',
                            url_path: 'test-category/child-2',
                            product_count: 3,
                            children_count: '1',
                            path: '1/3'
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: navigationMenuQuery,
            variables: {
                id: 2
            }
        },
        result: {
            data: {
                category: {
                    id: 2,
                    name: 'Child Category 1',
                    product_count: '5',
                    path: '1/2',
                    children: [
                        {
                            id: 4,
                            name: 'Child Leaf 1',
                            position: 1,
                            level: 2,
                            url_key: 'leaf-1',
                            url_path: 'test-category/child-1/leaf-1',
                            product_count: 4,
                            children_count: '0',
                            path: '1/2/4'
                        },
                        {
                            id: 5,
                            name: 'Child Leaf 2',
                            position: 2,
                            level: 2,
                            url_key: 'leaf-2',
                            url_path: 'test-category/child-1/leaf-2',
                            product_count: 2,
                            children_count: '0',
                            path: '1/2/5'
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: navigationMenuQuery,
            variables: {
                id: 3
            }
        },
        result: {
            data: {
                category: {
                    id: 3,
                    name: 'Child Category 2',
                    product_count: 3,
                    path: '1/3',
                    children: [
                        {
                            id: 6,
                            name: 'Child Leaf 3',
                            position: 1,
                            level: 2,
                            url_key: 'leaf-2',
                            url_path: 'test-category/child-2/leaf-3',
                            product_count: 6,
                            children_count: '0',
                            path: '1/3/6'
                        }
                    ]
                }
            }
        }
    }
];

const classes = {
    root: 'a',
    inactive: 'b'
};

function wait(callback) {
    setTimeout(() => {
        callback && callback();
    }, 1000);
}

beforeAll(() => {
    jest.useFakeTimers();
});

test('renders with product data', async () => {
    const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
            <CategoryMenu id={1} currentId={1} classes={classes} />
        </MockedProvider>
    );
    wait();
    jest.runAllTimers();
    wrapper.update();
    // There will be exactly one button for each child category (2),
    // and one mocked link for each leaf node (3)
    const buttons = wrapper.find('button');
    const links = wrapper.find('h6');
    expect(buttons.length).toBe(2);
    expect(links.length).toBe(3);
});

test('child node correctly sets new root and parent ids', () => {
    let selectedId = 1;
    let parentId = 0;
    const setSelectedId = id => {
        selectedId = id;
    };
    const setParentId = id => {
        parentId = id;
    };
    const wrapper = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
            <CategoryMenu
                id={1}
                currentId={selectedId}
                classes={classes}
                setRootNodeId={setSelectedId}
                setParentId={setParentId}
            />
        </MockedProvider>
    );
    wait();
    jest.runAllTimers();
    wrapper.update();
    const leaf3 = wrapper.find('button').last();
    leaf3.simulate('click');
    expect(selectedId).toEqual(3);
    expect(parentId).toEqual(1);
});
