import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import Boolean from '../boolean';

let inputProps = {};

const Component = () => {
    return <Boolean {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        attribute_metadata: {
            label: 'Boolean Label'
        }
    };
};

describe('#Boolean', () => {
    it('renders empty when no data is provided', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders label only when data is missing', () => {
        givenDefaultValues();
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders boolean when data is provided', () => {
        givenDefaultValues();
        inputProps = {
            ...inputProps,
            selected_attribute_options: {
                attribute_option: [
                    {
                        label: 'Yes'
                    }
                ]
            }
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
