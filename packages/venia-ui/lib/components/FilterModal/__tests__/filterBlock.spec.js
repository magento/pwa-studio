import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';

import { createTestInstance } from '@magento/peregrine';

import FilterBlock from '../filterBlock';

const mockHandleClick = jest.fn();
let mockIsExpanded;

jest.mock('informed', () => ({
    Form: ({ children, ...rest }) => <mock-Form {...rest}>{children}</mock-Form>
}));

jest.mock('../FilterList', () => props => <mock-FilterList {...props} />);

jest.mock('@magento/peregrine/lib/talons/FilterModal', () => ({
    useFilterBlock: jest.fn(() => {
        return {
            handleClick: mockHandleClick,
            isExpanded: mockIsExpanded
        };
    })
}));

let inputProps = {};

const Component = () => {
    return <FilterBlock {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        filterApi: jest.fn(),
        filterState: jest.fn(),
        group: 'Group',
        items: [],
        name: 'Name'
    };

    mockIsExpanded = false;
};

const givenExpanded = () => {
    mockIsExpanded = true;
};

describe('#FilterBlock', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders not expanded', () => {
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Form)).toThrow();
    });

    it('renders expanded', () => {
        givenExpanded();

        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Form)).not.toThrow();
    });

    it('renders not expanded and button is clicked', () => {
        const { root } = createTestInstance(<Component />);

        act(() => {
            root.findByType('button').props.onClick();
        });

        expect(mockHandleClick).toHaveBeenCalled();
    });
});
