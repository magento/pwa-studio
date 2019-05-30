import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import CategoryContent from '../categoryContent';

const classes = {
    root: 'a',
    title: 'b',
    gallery: 'c',
    pagination: 'd'
};

const data = {
    category: {
        products: {
            items: {
                id: 1
            }
        },
        description: 'test'
    }
};

test('renders the correct tree', () => {
    const shallowRenderer = new ShallowRenderer();
    const tree = shallowRenderer.render(
        <CategoryContent
            pageControl={{}}
            data={data}
            pageSize={6}
            classes={classes}
        />
    );

    expect(tree).toMatchSnapshot();
});
