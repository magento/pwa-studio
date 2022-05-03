import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import DateTime from '../dateTime';

jest.mock('react-intl', () => ({
    FormattedDate: props => <mock-FormattedDate {...props} />,
    FormattedTime: props => <mock-FormattedTime {...props} />
}));

let inputProps = {};

const Component = () => {
    return <DateTime {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        attribute_metadata: {
            label: 'DateTime Label'
        }
    };
};

describe('#DateTime', () => {
    it('renders empty when no data is provided', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders label only when data is missing', () => {
        givenDefaultValues();
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders date time when data is provided', () => {
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
