import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { mockFilterBlock } from '../filterBlock';
import { mockCurrentFilters } from '../CurrentFilters';
import FilterModal from '../filterModal';

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

jest.mock('../../../classify');

jest.mock('../../Portal', () => ({
    Portal: jest.fn(({ children }) => {
        return children;
    })
}));

jest.mock('react-aria', () => ({
    FocusScope: jest.fn(({ children }) => {
        return children;
    })
}));

jest.mock('@magento/peregrine/lib/talons/FilterModal', () => ({
    useFilterModal: jest.fn(({ filters }) => {
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
            handleClose: jest.fn(),
            handleReset: jest.fn(),
            handleKeyDownActions: jest.fn(),
            isOpen: true
        };
    })
}));

jest.mock('../filterBlock', () => {
    const mockedFilterBlock = jest.fn(() => {
        return null;
    });

    return {
        __esModule: true,
        default: mockedFilterBlock,
        mockFilterBlock: mockedFilterBlock
    };
});

jest.mock('../CurrentFilters', () => {
    const mockedCurrentFilters = jest.fn(() => {
        return null;
    });

    return {
        __esModule: true,
        default: mockedCurrentFilters,
        mockCurrentFilters: mockedCurrentFilters
    };
});

jest.mock('../filterFooter', () => {
    return jest.fn(() => {
        return null;
    });
});

let inputProps = {};

const Component = () => {
    return <FilterModal {...inputProps} />;
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

describe('#FilterModal', () => {
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
});
