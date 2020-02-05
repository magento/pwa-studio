import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ErrorView from '../errorView';

const renderer = new ShallowRenderer();

test('it renders correct with a element', () => {
    const tree = renderer.render(
        <ErrorView>
            <h1>Something went wrong. Please try again.</h1>
        </ErrorView>
    );

    expect(tree).toMatchSnapshot();
});
