import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import FilterList from '../filterList';
import FilterItem from '../filterItem';

const mockItems = [
    {
        title: 'Title A 1',
        value: 'Value A 1'
    },
    {
        title: 'Title A 2',
        value: 'Value A 2'
    }
];

const mockShowLess = 'Show Less';

const mockShowMore = 'Show More';

let mockIsListExpanded;

jest.mock('../filterItem', () => props => <mock-FilterItem {...props} />);

jest.mock('@magento/peregrine/lib/talons/FilterModal', () => ({
    useFilterList: jest.fn(() => {
        return {
            isListExpanded: mockIsListExpanded,
            handleListToggle: jest.fn()
        };
    })
}));

let inputProps = {};

const Component = () => {
    return <FilterList {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        filterApi: jest.fn(),
        filterState: jest.fn(),
        group: 'Group',
        items: mockItems
    };

    mockIsListExpanded = false;
};

const givenShowMore = () => {
    inputProps = {
        ...inputProps,
        itemCountToShow: 1
    };
};

const givenExpanded = () => {
    mockIsListExpanded = true;
};

describe('#FilterList', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders without show more button', () => {
        const { root } = createTestInstance(<Component />);

        expect(root.findAllByType(FilterItem)).toHaveLength(2);
        expect(() => root.findByType('button')).toThrow();
    });

    it('renders with show more button', () => {
        givenShowMore();

        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType('button')).not.toThrow();
        expect(root.findByType('button').children[0]).toBe(mockShowMore);
    });

    it('renders with show less button', () => {
        givenShowMore();
        givenExpanded();

        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType('button')).not.toThrow();
        expect(root.findByType('button').children[0]).toBe(mockShowLess);
    });
});
