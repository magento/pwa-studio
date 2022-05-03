import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import CustomAttributes, { IS_VISIBLE_ON_FRONT } from '../customAttributes';

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
                        used_in_components: [IS_VISIBLE_ON_FRONT],
                        uid: 'uid-1'
                    }
                },
                {
                    attribute_metadata: {
                        used_in_components: [IS_VISIBLE_ON_FRONT],
                        uid: 'uid-2'
                    }
                },
                {
                    attribute_metadata: {
                        used_in_components: [],
                        uid: 'uid-3'
                    }
                },
                {
                    attribute_metadata: {
                        used_in_components: [IS_VISIBLE_ON_FRONT],
                        uid: 'uid-4'
                    }
                },
                {
                    attribute_metadata: {
                        uid: 'uid-5'
                    }
                }
            ]
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
