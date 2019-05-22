import React, { useEffect } from 'react';
import { createTestInstance, useQuery } from '@magento/peregrine';

import EditItem from '../editItem';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    return Object.assign(React, { useEffect: jest.fn(React.useEffect) });
});
jest.mock('@magento/peregrine');
jest.mock('../cartOptions');
jest.mock('src/components/LoadingIndicator', () => {
    return {
        __esModule: true,
        loadingIndicator: '( Loading Indicator Component Here )'
    };
});

test('renders null when item not supplied', () => {
    const tree = createTestInstance(
        <EditItem />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders cart options when item has no options', () => {
    const props = {
        item: {
            options: []
        }
    };

    const tree = createTestInstance(
        <EditItem {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders a loading indicator while running query', () => {
    const props = {
        item: {
            options: ['a', 'b', 'c']
        }
    };

    const tree = createTestInstance(
        <EditItem {...props} />
    ).toJSON();

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
    useQuery.mockReturnValueOnce([ queryResult, queryApi ]);
    useEffect.mockReturnValueOnce(undefined);

    const props = {
        item: {
            options: ['a', 'b', 'c']
        }
    };

    const tree = createTestInstance(
        <EditItem {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
