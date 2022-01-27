import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import DynamicBlock from '../dynamicBlock';

jest.mock('../../RichContent', () => props => <mock-RichContent {...props} />);

let inputProps = {};

const Component = () => {
    return <DynamicBlock {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        content: {
            html: 'Hello World'
        }
    };
};

describe('#DynamicBlock', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders', () => {
        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });
});
