import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { runQuery, useLazyQuery } from '@apollo/react-hooks';

import EditItem from '../editItem';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useEffect');

    return Object.assign(React, { useEffect: spy });
});
jest.mock('@apollo/react-hooks', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };
    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return { runQuery, useLazyQuery };
});

const renderer = new ShallowRenderer();

const props = {
    endEditItem: jest.fn(),
    item: {
        item_id: 1,
        name: 'unit test',
        options: ['a', 'b', 'c'],
        price: 99,
        qty: 1
    },
    updateItemInCart: jest.fn()
};

test('renders cart options when item has no options', () => {
    const myProps = {
        ...props,
        item: {
            ...props.item,
            options: []
        }
    };

    const tree = renderer.render(<EditItem {...myProps} />);

    expect(tree).toMatchSnapshot();
});

test('renders a loading indicator while running query', () => {
    const queryResult = {
        data: null,
        error: false,
        loading: true
    };
    useLazyQuery.mockReturnValueOnce([runQuery, queryResult]);

    const tree = renderer.render(<EditItem {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders a loading indicator if no data', () => {
    const queryResult = {
        data: null,
        error: false,
        loading: false
    };
    useLazyQuery.mockReturnValueOnce([runQuery, queryResult]);

    const tree = renderer.render(<EditItem {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders an error message when an error occurs', () => {
    const queryResult = {
        data: null,
        error: true,
        loading: false
    };
    useLazyQuery.mockReturnValueOnce([runQuery, queryResult]);

    const tree = renderer.render(<EditItem {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders cart options when item has options', () => {
    const queryResult = {
        data: {
            products: {
                items: [{}]
            }
        }
    };
    useLazyQuery.mockReturnValueOnce([runQuery, queryResult]);

    const tree = renderer.render(<EditItem {...props} />);

    expect(tree).toMatchSnapshot();
});
