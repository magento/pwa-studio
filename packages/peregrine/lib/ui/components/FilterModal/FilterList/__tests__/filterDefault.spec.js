import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import Checkbox from '../../../Checkbox';
import FilterDefault from '../filterDefault';

jest.mock('../../../Checkbox', () => props => <mock-Checkbox {...props} />);

const mockLabel = 'Item Label';

let inputProps = {};

const Component = () => {
    return <FilterDefault {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        isSelected: false,
        item: null
    };
};

const givenWithItem = () => {
    inputProps = {
        ...inputProps,
        item: {
            label: mockLabel,
            value_index: 'item_value_index'
        }
    };
};

const givenWithSelectedItem = () => {
    inputProps = {
        ...inputProps,
        isSelected: true
    };
};

describe('#FilterDefault', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders without item', () => {
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Checkbox)).not.toThrow();

        expect(() => root.findByType(Checkbox)).not.toThrow();
        expect(root.findByType(Checkbox).props.fieldValue).toBe(false);
        expect(root.findByType(Checkbox).props.label).toBeUndefined();
    });

    it('renders with item', () => {
        givenWithItem();

        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Checkbox)).not.toThrow();
        expect(root.findByType(Checkbox).props.fieldValue).toBe(false);
        expect(root.findByType(Checkbox).props.label).toBe(mockLabel);
    });

    it('renders with selected item', () => {
        givenWithItem();
        givenWithSelectedItem();

        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Checkbox)).not.toThrow();
        expect(root.findByType(Checkbox).props.fieldValue).toBe(true);
        expect(root.findByType(Checkbox).props.label).toBe(mockLabel);
    });
});
