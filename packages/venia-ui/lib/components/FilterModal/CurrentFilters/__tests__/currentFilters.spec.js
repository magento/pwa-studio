import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import CurrentFilters from '../currentFilters';
import CurrentFilter from '../currentFilter';

const mockOnRemove = jest.fn();

const mockFilterItems = [
    [
        'group-a',
        [
            {
                title: 'Title A 1',
                value: 'Value A 1'
            },
            null
        ]
    ],
    [
        'group-b',
        [
            {
                title: 'Title B 1',
                value: 'Value B 1'
            }
        ]
    ]
];

const mockFilterState = new Map(mockFilterItems);

jest.mock('../currentFilter', () => props => <mock-CurrentFilter {...props} />);

let inputProps = {};

const Component = () => {
    return <CurrentFilters {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        filterApi: jest.fn(),
        filterState: mockFilterState,
        onRemove: mockOnRemove
    };
};

describe('#CurrentFilters', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders', () => {
        const { root } = createTestInstance(<Component />);

        expect(root.findAllByType(CurrentFilter)).toHaveLength(3);
    });
});
