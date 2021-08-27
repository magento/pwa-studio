import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import FilterList from '../FilterList';
import FilterBlock from '../filterBlock';

let mockIsExpanded;

jest.mock('../FilterList', () => props => <mock-FilterList {...props} />);

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

    mockIsExpanded = false;
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
