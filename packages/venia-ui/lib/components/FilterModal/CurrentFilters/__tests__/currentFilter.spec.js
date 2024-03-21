import React from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';

import Trigger from '../../../Trigger';
import CurrentFilter from '../currentFilter';

const mockItem = {
    title: 'Item Title'
};

const mockRemoveItem = jest.fn();

const mockOnRemove = jest.fn();

jest.mock('../../../Trigger', () => props => <mock-Trigger {...props} />);

let inputProps = {};

const Component = () => {
    return <CurrentFilter {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        group: 'group',
        item: mockItem,
        removeItem: mockRemoveItem
    };
};

const givenValuesWithOnRemove = () => {
    inputProps = {
        ...inputProps,
        onRemove: mockOnRemove
    };
};

describe('#CurrentFilter', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders', () => {
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Trigger)).not.toThrow();
    });

    it('handles when a user clicks on remove and onRemove is not provided', () => {
        const { root } = createTestInstance(<Component />);

        act(() => {
            root.findByType(Trigger).props.action();
        });

        expect(mockRemoveItem).toHaveBeenCalled();
    });

    it('handles when a user clicks on remove and onRemove is provided', () => {
        givenValuesWithOnRemove();

        const { root } = createTestInstance(<Component />);

        act(() => {
            root.findByType(Trigger).props.action();
        });

        expect(mockRemoveItem).toHaveBeenCalled();
        expect(mockOnRemove).toHaveBeenCalled();
    });
});
