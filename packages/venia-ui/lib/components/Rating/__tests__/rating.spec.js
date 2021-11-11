import React from 'react';
import TestRenderer from 'react-test-renderer';
import Rating from '../rating';

const props = {
    rating: 3
};

test('renders the correct tree', () => {
    const tree = TestRenderer.create(<Rating {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
