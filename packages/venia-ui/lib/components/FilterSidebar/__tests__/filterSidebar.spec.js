import React from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';

import FilterBlock, { mockFilterBlock } from '../../FilterModal/filterBlock';
import { mockCurrentFilters } from '../../FilterModal/CurrentFilters';
import LinkButton from '../../LinkButton';
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

const mockHandleApply = jest.fn();

const mockScrollTo = jest.fn();

const mockGetBoundingClientRect = jest.fn();

let mockFilterState;

jest.mock('../../LinkButton', () => props => <mock-LinkButton {...props} />);

jest.mock('@magento/peregrine/lib/talons/FilterSidebar', () => ({
    useFilterSidebar: jest.fn(({ filters }) => {
        const names = new Map();
        const itemsByGroup = new Map();
        const filterFrontendInput = new Map();

        for (const filter of filters) {
            const {
                options,
                label: name,
                attribute_code: group,
                frontend_input
            } = filter;
            const items = [];
            // add filter name
            names.set(group, name);
            filterFrontendInput.set(group, frontend_input);
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
            filterFrontendInput,
            filterState: mockFilterState,
            handleApply: mockHandleApply,
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

    mockFilterState = new Map();
};

const givenFilters = () => {
    inputProps = {
        filters: mockFilters
    };
};

const givenSelectedFilters = () => {
    inputProps = {
        filters: mockFilters
    };

    mockFilterState = new Map([['group', 'item']]);
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

    it('renders with filters and no selected filters', () => {
        givenFilters();

        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(LinkButton)).toThrow();
        expect(mockFilterBlock).toHaveBeenCalledTimes(mockFilters.length);
    });

    it('renders with filters and selected filter', () => {
        givenSelectedFilters();

        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(LinkButton)).not.toThrow();
        expect(mockFilterBlock).toHaveBeenCalledTimes(mockFilters.length);
    });

    it('handles when a user applies a filter and ref is not provided', () => {
        givenSelectedFilters();

        const { root } = createTestInstance(<Component />);

        act(() => {
            root.findAllByType(FilterBlock)[0].props.onApply();
        });

        expect(mockHandleApply).toHaveBeenCalled();
    });

    it('handles when a user applies a filter and ref is provided', () => {
        givenSelectedFilters();

        Object.defineProperty(window, 'scrollTo', {
            configurable: true,
            writable: true,
            value: mockScrollTo
        });

        const { root } = createTestInstance(<Component />, {
            createNodeMock: () => {
                return {
                    getBoundingClientRect: mockGetBoundingClientRect.mockReturnValue(
                        {
                            top: 250
                        }
                    )
                };
            }
        });

        act(() => {
            root.findAllByType(FilterBlock)[0].props.onApply();
        });

        expect(mockGetBoundingClientRect).toBeCalledTimes(1);
        expect(window.scrollTo).toBeCalledTimes(1);
        expect(mockHandleApply).toHaveBeenCalled();
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
