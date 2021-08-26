import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import FilterBlock from '../filterBlock';
import FilterList from '../filterList';

let mockIsExpanded = false;

jest.mock('../filterList', () => props => <mock-FilterList {...props} />);

jest.mock('@magento/peregrine/lib/talons/FilterModal', () => ({
    useFilterBlock: jest.fn(() => {
        return {
            handleClick: jest.fn(),
            isExpanded: mockIsExpanded
        };
    })
}));

let inputProps = {};

const Component = () => {
    return <FilterBlock {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        filterApi: jest.fn(),
        filterState: jest.fn(),
        group: 'Group',
        items: [],
        name: 'Name'
    };
};

const givenExpanded = () => {
    mockIsExpanded = true;
};

describe('#FilterBlock', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders not expanded', () => {
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(FilterList)).not.toThrow();
        expect(root.findByType(FilterList).props.isExpanded).toBe(false);
    });

    it('renders expanded', () => {
        givenExpanded();

        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(FilterList)).not.toThrow();
        expect(root.findByType(FilterList).props.isExpanded).toBe(true);
    });
});
