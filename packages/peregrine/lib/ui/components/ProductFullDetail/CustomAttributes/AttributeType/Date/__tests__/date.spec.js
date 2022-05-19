import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import Date from '../date';

jest.mock('react-intl', () => ({
    FormattedDate: props => <mock-FormattedDate {...props} />
}));

let inputProps = {};

const Component = () => {
    return <Date {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        attribute_metadata: {
            label: 'Date Label'
        }
    };
};

describe('#Date', () => {
    it('renders empty when no data is provided', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders label only when data is missing', () => {
        givenDefaultValues();
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders date when data is provided', () => {
        givenDefaultValues();
        inputProps = {
            ...inputProps,
            entered_attribute_value: {
                value: '2019-08-27 12:00:00'
            }
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
