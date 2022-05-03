import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { mockRadio } from '../../../RadioGroup/radio';
import FilterItemRadio from '../filterItemRadio';

const mockOnApply = jest.fn();

jest.mock('../../../RadioGroup/radio', () => {
    const mockedRadio = jest.fn(({ onChange }) => {
        onChange({
            target: {
                value: 'foo'
            }
        });
        return null;
    });

    return {
        __esModule: true,
        default: mockedRadio,
        mockRadio: mockedRadio
    };
});

let inputProps = {};

const Component = () => {
    return <FilterItemRadio {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        filterApi: {
            toggleItem: jest.fn(),
            removeGroup: jest.fn()
        },
        labels: new WeakMap(),
        group: 'Foo',
        item: {
            title: 'Bar',
            value: 'bar',
            label: 'Bar: bar'
        },
        onApply: null
    };
};

const givenOnApply = () => {
    inputProps = {
        filterApi: {
            toggleItem: jest.fn(),
            removeGroup: jest.fn()
        },
        labels: new WeakMap(),
        group: 'Foo',
        item: {
            title: 'Bar',
            value: 'bar',
            label: 'Bar: bar'
        },
        onApply: mockOnApply
    };
};

const givenSelectedItem = () => {
    const item = {
        title: 'Foo',
        value: 'foo',
        label: 'Foo: foo'
    };

    inputProps = {
        filterApi: {
            toggleItem: jest.fn(),
            removeGroup: jest.fn()
        },
        labels: new WeakMap(),
        group: 'Foo',
        item: item,
        onApply: mockOnApply
    };
};

describe('#FilterItemRadio', () => {
    beforeEach(() => {
        mockRadio.mockClear();
        mockOnApply.mockClear();

        givenDefaultValues();
    });

    it('passes props to Radio', () => {
        createTestInstance(<Component />);

        expect(mockRadio).toHaveBeenCalledWith(
            expect.objectContaining({
                onChange: expect.any(Function)
            }),
            {}
        );
    });

    it('handles no onApply function being passed', () => {
        createTestInstance(<Component />);

        expect(inputProps.filterApi.removeGroup).toHaveBeenCalledWith({
            group: inputProps.group
        });
    });

    it('calls onApply when passed', () => {
        givenOnApply();
        createTestInstance(<Component />);

        expect(inputProps.filterApi.removeGroup).toHaveBeenCalledWith({
            group: inputProps.group
        });
        expect(mockOnApply).toHaveBeenCalled();
    });

    it('determines the item is selected', () => {
        givenSelectedItem();
        createTestInstance(<Component />);

        expect(inputProps.filterApi.removeGroup).toHaveBeenCalledWith({
            group: inputProps.group
        });
        expect(inputProps.filterApi.toggleItem).toHaveBeenCalledWith({
            group: inputProps.group,
            item: inputProps.item
        });
        expect(mockOnApply).toHaveBeenCalled();
    });
});
