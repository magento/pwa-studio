import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import AriaButton from '../ariaButton';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn()
}));

jest.mock('react-aria', () => ({
    useButton: jest.fn(() => {
        return {
            buttonProps: {}
        };
    })
}));

let inputProps = {};

const Component = () => {
    return <AriaButton {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        children: 'Children'
    };
};

describe('#AriaButton', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders', () => {
        const tree = createTestInstance(<Component />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
