import React, { useEffect } from 'react';
import ShallowRenderer from 'react-test-renderer/Shallow';
import { useQuery } from '@magento/peregrine';

import EditItem from '../editItem';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useEffect');

    return Object.assign(React, { useEffect: spy });
});
jest.mock('@magento/peregrine');

const renderer = new ShallowRenderer();

test('renders null when item not supplied', () => {
    const tree = renderer.render(<EditItem />);

    expect(tree).toMatchSnapshot();
});

test('renders cart options when item has no options', () => {
    const props = {
        item: {
            options: []
        }
    };

    const tree = renderer.render(<EditItem {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders a loading indicator while running query', () => {
    const props = {
        item: {
            options: ['a', 'b', 'c']
        }
    };

    const tree = renderer.render(<EditItem {...props} />);

    expect(tree).toMatchSnapshot();
});

test('renders cart options when item has options', () => {
    const queryApi = {
        runQuery: jest.fn(),
        setLoading: jest.fn()
    };
    const queryResult = {
        data: {
            products: {
                items: []
            }
        }
    };
    useQuery.mockReturnValueOnce([queryResult, queryApi]);
    useEffect.mockReturnValueOnce(undefined);

    const props = {
        item: {
            options: ['a', 'b', 'c']
        }
    };

    const tree = renderer.render(<EditItem {...props} />);

    expect(tree).toMatchSnapshot();
});
