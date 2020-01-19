import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ErrorView, { ERROR_TYPES, errorMap } from '../errorView';

const renderer = new ShallowRenderer();

test('it renders the correct tree when loading', () => {
    const tree = renderer.render(<ErrorView type={ERROR_TYPES.LOADING} />);

    expect(tree).toMatchSnapshot();
});

test('it renders the correct tree when page not found', () => {
    const tree = renderer.render(<ErrorView type={ERROR_TYPES.NOT_FOUND} />);

    expect(tree).toMatchSnapshot();
});

test('it renders the correct tree when out of stock', () => {
    ERROR_TYPES.CUSTOM = 'custom';
    errorMap.set(ERROR_TYPES.CUSTOM, 'Nice Error Message!');
    const tree = renderer.render(<ErrorView type={ERROR_TYPES.CUSTOM} />);

    expect(tree).toMatchSnapshot();
});

test('it renders the internal error tree otherwise', () => {
    const tree = renderer.render(<ErrorView />);

    expect(tree).toMatchSnapshot();
});
