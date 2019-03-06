import React from 'react';
import TestRenderer from 'react-test-renderer';

import SuggestedCategories from '../suggestedCategories';

jest.mock('src/classify');
jest.mock('src/drivers', () => ({
    Link: ({ children }) => children,
    resourceUrl: jest.fn()
}));

const defaultProps = {
    handleCategorySearch: jest.fn(),
    autocompleteQuery: 'query',
    categorySuggestions: [
        {
            value_string: 'foo',
            label: 'label'
        }
    ]
};

test('renders a suggestedProduct component', () => {
    const component = TestRenderer.create(
        <SuggestedCategories {...defaultProps} />
    );

    expect(component.toJSON()).toMatchSnapshot();
});
