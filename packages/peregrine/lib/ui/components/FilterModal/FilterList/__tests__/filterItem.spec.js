import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { mockFilterDefault } from '../filterDefault';
import FilterItem from '../filterItem';

const mockOnApply = jest.fn();

jest.mock('../filterDefault', () => {
    const mockedFilterDefault = jest.fn(({ onMouseDown }) => {
        onMouseDown({
            button: 0
        });
        return null;
    });

    return {
        __esModule: true,
        default: mockedFilterDefault,
        mockFilterDefault: mockedFilterDefault
    };
});

let inputProps = {};

const Component = () => {
    return <FilterItem {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        filterApi: {
            toggleItem: jest.fn()
        },
        filterState: new Set(),
        group: 'Foo',
        item: {
            title: 'Bar',
            value: 'bar'
        },
        onApply: null
    };
};

const givenOnApply = () => {
    inputProps = {
        filterApi: {
            toggleItem: jest.fn()
        },
        filterState: new Set(),
        group: 'Foo',
        item: {
            title: 'Bar',
            value: 'bar'
        },
        onApply: mockOnApply
    };
};

const givenSelectedItem = () => {
    const item = {
        title: 'Bar',
        value: 'bar'
    };

    inputProps = {
        filterApi: {
            toggleItem: jest.fn()
        },
        filterState: new Set().add(item),
        group: 'Foo',
        item: item
    };
};

describe('#FilterItem', () => {
    beforeEach(() => {
        mockFilterDefault.mockClear();
        mockOnApply.mockClear();

        givenDefaultValues();
    });

    it('passes props to FilterDefault', () => {
        createTestInstance(<Component />);

        expect(mockFilterDefault).toHaveBeenCalledWith(
            expect.objectContaining({
                isSelected: false,
                onKeyDown: expect.any(Function),
                onMouseDown: expect.any(Function)
            }),
            {}
        );
    });

    it('handles no onApply function being passed', () => {
        createTestInstance(<Component />);

        expect(inputProps.filterApi.toggleItem).toHaveBeenCalledWith({
            group: inputProps.group,
            item: inputProps.item
        });
    });

    it('calls onApply when passed', () => {
        givenOnApply();
        createTestInstance(<Component />);

        expect(inputProps.filterApi.toggleItem).toHaveBeenCalledWith({
            group: inputProps.group,
            item: inputProps.item
        });
        expect(mockOnApply).toHaveBeenCalled();
    });

    it('determines the item is selected', () => {
        givenSelectedItem();
        createTestInstance(<Component />);

        expect(mockFilterDefault).toHaveBeenCalledWith(
            expect.objectContaining({
                onMouseDown: expect.any(Function),
                onKeyDown: expect.any(Function),
                isSelected: true
            }),
            {}
        );
    });

    it('calls onApply when keyboard Enter or space is pressed', () => {
        givenOnApply();
        mockFilterDefault.mockImplementationOnce(({ onKeyDown }) => {
            onKeyDown({
                key: 'Enter',
                preventDefault: jest.fn()
            });
            return null;
        });

        createTestInstance(<Component />);
        expect(mockOnApply).toHaveBeenCalled();
    });

    it('does not call onApply with right mouse click', () => {
        givenOnApply();
        mockFilterDefault.mockImplementationOnce(({ onMouseDown }) => {
            onMouseDown({
                button: 1
            });
            return null;
        });
        createTestInstance(<Component />);
        expect(mockOnApply).not.toHaveBeenCalled();
    });
});
