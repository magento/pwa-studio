import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ErrorView from '../errorView';

const renderer = new ShallowRenderer();

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(() => ({ push: jest.fn() }))
    };
});

test('it renders correct with a element', () => {
    const ERROR_TEXT = 'Something went wrong. Please try again.';
    const tree = renderer.render(
        <ErrorView>
            <h1>{ERROR_TEXT}</h1>
        </ErrorView>
    );

    expect(tree).toMatchSnapshot();
});
