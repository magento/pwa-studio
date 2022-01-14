import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import CustomAttributes from '../customAttributes';

jest.mock('react-intl', () => ({
    FormattedMessage: ({ defaultMessage }) => defaultMessage
}));

jest.mock('../AttributeType', () => {
    return props => <mock-AttributeType {...props} />;
});

let inputProps = {};

const Component = () => {
    return <CustomAttributes {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        customAttributes: []
    };
};

describe('#CustomAttributes', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders without custom attributes', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders with custom attributes visible on front only', () => {
        inputProps = {
            customAttributes: [
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        uid: 'uid-1'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        uid: 'uid-2'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: false,
                        uid: 'uid-3'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        uid: 'uid-4'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: false,
                        uid: 'uid-5'
                    }
                }
            ]
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
