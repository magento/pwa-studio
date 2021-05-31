import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { mockFilterBlock } from '../../FilterModal/filterBlock';
import { mockCurrentFilters } from '../../FilterModal/CurrentFilters';
import FilterSidebar from '../filterSidebar';

const mockFilters = [
    {
        attribute_code: 'foo',
        label: 'Foo',
        options: [
            {
                label: 'value 1',
                value: 1
            }
        ]
    },
    {
        attribute_code: 'bar',
        label: 'Bar',
        options: [
            {
                label: 'value 1',
                value: 1
            },
            {
                label: 'value 2',
                value: 2
            }
        ]
    },
    {
        attribute_code: 'baz',
        label: 'Baz',
        options: [
            {
                label: 'value 1',
                value: 1
            }
        ]
    }
];

const mockFiltersOpenCount = 2;

jest.mock('@magento/peregrine/lib/talons/FilterSidebar', () => ({
    useFilterSidebar: jest.fn(({ filters }) => {
        const names = new Map();
        const itemsByGroup = new Map();

        for (const filter of filters) {
            const { options, label: name, attribute_code: group } = filter;
            const items = [];
            // add filter name
            names.set(group, name);

            // add items
            for (const { label, value } of options) {
                items.push({ title: label, value });
            }
            itemsByGroup.set(group, items);
        }

        return {
            filterApi: null,
            filterItems: itemsByGroup,
            filterNames: names,
            filterState: new Map(),
            handleApply: jest.fn(),
            handleReset: jest.fn()
        };
    })
}));

jest.mock('../../FilterModal/filterBlock', () => {
    const mockedFilterBlock = jest.fn(() => {
        return null;
    });

    return {
        __esModule: true,
        default: mockedFilterBlock,
        mockFilterBlock: mockedFilterBlock
    };
});

jest.mock('../../FilterModal/CurrentFilters', () => {
    const mockedCurrentFilters = jest.fn(() => {
        return null;
    });

    return {
        __esModule: true,
        default: mockedCurrentFilters,
        mockCurrentFilters: mockedCurrentFilters
    };
});

let inputProps = {};

const Component = () => {
    return <FilterSidebar {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        filters: []
    };
};

const givenFilters = () => {
    inputProps = {
        filters: mockFilters
    };
};

const givenFiltersAndAmountToShow = () => {
    inputProps = {
        filters: mockFilters,
        filterCountToOpen: mockFiltersOpenCount
    };
};

describe('#FilterSidebar', () => {
    beforeEach(() => {
        mockFilterBlock.mockClear();
        mockCurrentFilters.mockClear();

        givenDefaultValues();
    });

    it('renders without filters', () => {
        createTestInstance(<Component />);

        expect(mockFilterBlock).not.toHaveBeenCalled();
        expect(mockCurrentFilters).toHaveBeenCalled();
    });

    it('renders with filters', () => {
        givenFilters();
        createTestInstance(<Component />);

        expect(mockFilterBlock).toHaveBeenCalledTimes(mockFilters.length);
    });

    it('accepts configurable amount of open filters', () => {
        givenFiltersAndAmountToShow();
        createTestInstance(<Component />);

        expect(mockFilterBlock).toHaveBeenCalledTimes(mockFilters.length);

        for (let i = 1; i <= mockFilters.length; i++) {
            expect(mockFilterBlock).toHaveBeenNthCalledWith(
                i,
                expect.objectContaining({
                    initialOpen: i <= mockFiltersOpenCount
                }),
                expect.any(Object)
            );
        }
    });
});
