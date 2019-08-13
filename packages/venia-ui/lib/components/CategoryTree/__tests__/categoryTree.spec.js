import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance, useQuery } from '@magento/peregrine';

import CategoryTree from '../categoryTree';

jest.mock('@magento/peregrine');
jest.mock('../../../classify');
jest.mock('../categoryBranch', () => () => <i />);
jest.mock('../categoryLeaf', () => () => <i />);

const queryState = {
    data: null,
    error: null,
    loading: false
};
const queryApi = {
    resetState: jest.fn(),
    runQuery: jest.fn(),
    setLoading: jest.fn()
};

useQuery.mockImplementation(() => [queryState, queryApi]);

const props = {
    categories: {},
    categoryId: 1,
    onNavigate: jest.fn(),
    setCategoryId: jest.fn(),
    updateCategories: jest.fn()
};

const categories = {
    1: {
        children: [2, 4],
        children_count: 2,
        id: 1,
        name: 'One',
        path: '1'
    },
    2: {
        id: 2,
        include_in_menu: 1,
        name: 'Two',
        parentId: 1,
        path: '1/2',
        productImagePreview: {
            items: [{ small_image: 'media/img-2.jpg' }]
        }
    },
    3: {
        id: 3,
        include_in_menu: 1,
        name: 'Three',
        parentId: 2,
        path: '1/2/3',
        productImagePreview: {
            items: [{ small_image: 'media/img-3.jpg' }]
        }
    },
    4: {
        id: 4,
        include_in_menu: 1,
        name: 'Four',
        parentId: 1,
        path: '1/4',
        productImagePreview: {
            items: [{ small_image: 'media/img-4.jpg' }]
        }
    }
};

test('renders correctly without data', async () => {
    const instance = createTestInstance(<CategoryTree {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('calls runQuery on mount', () => {
    const { runQuery } = queryApi;
    createTestInstance(<CategoryTree {...props} />);

    act(() => {});

    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenNthCalledWith(1, {
        variables: {
            id: props.categoryId
        }
    });
});

test('calls runQuery when categoryId changes', () => {
    const { runQuery } = queryApi;
    const instance = createTestInstance(<CategoryTree {...props} />);

    act(() => {
        instance.update(<CategoryTree {...props} categoryId={2} />);
    });

    expect(runQuery).toHaveBeenCalledTimes(2);
    expect(runQuery).toHaveBeenNthCalledWith(2, {
        variables: {
            id: 2
        }
    });
});

test('avoids calling runQuery without a category id', () => {
    const { runQuery } = queryApi;
    createTestInstance(<CategoryTree {...props} categoryId={null} />);

    act(() => {});

    expect(runQuery).not.toHaveBeenCalled();
});

test('avoids calling updateCategories without data', () => {
    const { updateCategories } = props;
    createTestInstance(<CategoryTree {...props} />);

    act(() => {});

    expect(updateCategories).not.toHaveBeenCalled();
});

test('renders correctly with data', () => {
    const instance = createTestInstance(
        <CategoryTree {...props} categories={categories} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('calls updateCategories when data changes', () => {
    const { updateCategories } = props;
    const category = categories[1];
    const data = {
        category: {
            ...category,
            children: Array.from(category.children, id => categories[id])
        }
    };

    const nextQueryState = { ...queryState, data };

    useQuery.mockImplementationOnce(() => [nextQueryState, queryApi]);

    createTestInstance(<CategoryTree {...props} />);

    act(() => {});

    expect(updateCategories).toHaveBeenCalledTimes(1);
    expect(updateCategories).toHaveBeenNthCalledWith(1, data.category);
});

// test('child node correctly sets new root and parent ids', async () => {
//     const rootNodeId = 1;
//     const currentId = 1;
//     const setCurrentPath = jest.fn();

//     const { root } = TestRenderer.create(
//         <MockedProvider mocks={mocks} addTypename={false}>
//             <MemoryRouter>
//                 <CategoryTree
//                     rootNodeId={rootNodeId}
//                     currentId={currentId}
//                     updateRootNodeId={setCurrentPath}
//                     classes={classes}
//                 />
//             </MemoryRouter>
//         </MockedProvider>
//     );

//     await waitForExpect(() => {
//         const child = root.findByProps({ path: '1/3' });
//         const { onDive, path } = child.props;

//         onDive(path);

//         expect(setCurrentPath).toHaveBeenLastCalledWith(path);
//     });
// });
