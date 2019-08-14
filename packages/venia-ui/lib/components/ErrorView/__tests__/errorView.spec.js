import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ErrorView from '../errorView';

const renderer = new ShallowRenderer();

test('it renders the correct tree when loading', () => {
    const tree = renderer.render(<ErrorView loading={true} />);

    expect(tree).toMatchSnapshot();
});

test('it renders the correct tree when page not found', () => {
    const tree = renderer.render(<ErrorView notFound={true} />);

    expect(tree).toMatchSnapshot();
});

test('it renders the correct tree when out of stock', () => {
    const tree = renderer.render(<ErrorView outOfStock={true} />);

    expect(tree).toMatchSnapshot();
});

test('it renders the internal error tree otherwise', () => {
    const tree = renderer.render(<ErrorView />);

    expect(tree).toMatchSnapshot();
});
