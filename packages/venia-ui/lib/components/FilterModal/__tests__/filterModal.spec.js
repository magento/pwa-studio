import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import LinkButton from '../../LinkButton';
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
    },
    {
        attribute_code: 'boolean_filter',
        label: 'Boolean Filter',
        options: [
            {
                __typename: 'AggregationOption',
                label: '0',
                value: '0'
            },
            {
                __typename: 'AggregationOption',
                label: '1',
                value: '1'
            }
        ]
    }
];

let mockFilterState;

let mockIsOpen;

jest.mock('../../LinkButton', () => props => <mock-LinkButton {...props} />);

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

// TODO: Get all frontend input type from gql if other filter input types are needed
// See: https://github.com/magento-commerce/magento2-pwa/pull/26
const isBooleanFilter = options => {
    return (
        options.length === 2 &&
        JSON.stringify(options[0]) ===
            JSON.stringify({
                __typename: 'AggregationOption',
                label: '0',
                value: '0'
            }) &&
        JSON.stringify(options[1]) ===
            JSON.stringify({
                __typename: 'AggregationOption',
                label: '1',
                value: '1'
            })
    );
};

jest.mock('@magento/peregrine/lib/talons/FilterModal', () => ({
    useFilterModal: jest.fn(({ filters }) => {
        const names = new Map();
        const filterFrontendInput = new Map();
        const itemsByGroup = new Map();

        for (const filter of filters) {
            const { options, label: name, attribute_code: group } = filter;
            const items = [];
            // add filter name
            names.set(group, name);

            if (isBooleanFilter(options)) {
                filterFrontendInput.set(group, 'boolean');
                // add items
                items.push({
                    title: 'No',
                    value: '0',
                    label: name + ': ' + 'No'
                });
                items.push({
                    title: 'Yes',
                    value: '1',
                    label: name + ': ' + 'Yes'
                });
            } else {
                filterFrontendInput.set(group, null);

                // add items
                for (const { label, value } of options) {
                    items.push({ title: label, value });
                }
            }
            itemsByGroup.set(group, items);
        }

        return {
            filterApi: null,
            filterItems: itemsByGroup,
            filterNames: names,
            filterFrontendInput,
            filterState: mockFilterState,
            handleApply: jest.fn(),
            handleClose: jest.fn(),
            handleReset: jest.fn(),
            handleKeyDownActions: jest.fn(),
            isOpen: mockIsOpen
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

    mockFilterState = new Map();
    mockIsOpen = true;
};

const givenFilters = () => {
    inputProps = {
        filters: mockFilters
    };
};

const givenSelectedFilters = () => {
    mockFilterState = new Map([['group', 'item']]);
};

const givenClosed = () => {
    mockIsOpen = false;
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

    it('renders without selected filters', () => {
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(LinkButton)).toThrow();
    });

    it('renders with selected filters', () => {
        givenSelectedFilters();
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(LinkButton)).not.toThrow();
    });

    it('renders when closed', () => {
        givenClosed();
        createTestInstance(<Component />);

        expect(mockFilterBlock).not.toHaveBeenCalled();
        expect(mockCurrentFilters).not.toHaveBeenCalled();
    });
});
