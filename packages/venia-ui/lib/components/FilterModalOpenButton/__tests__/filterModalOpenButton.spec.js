import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import FilterModalOpenButton from '../filterModalOpenButton';
import Button from '../../Button';

const mockHandleOpen = jest.fn();

jest.mock('../../Button', () => props => <mock-Button {...props} />);

jest.mock('@magento/peregrine/lib/talons/FilterModal', () => ({
    useFilterModal: jest.fn(() => {
        return {
            handleOpen: mockHandleOpen
        };
    })
}));

let inputProps = {};

const Component = () => {
    return <FilterModalOpenButton {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        filters: []
    };
};

describe('#FilterModalOpenButton', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders', () => {
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Button)).not.toThrow();
        expect(root.findByType(Button).props.onClick).toBe(mockHandleOpen);
    });
});
