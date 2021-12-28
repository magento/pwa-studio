import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';

import { createTestInstance } from '@magento/peregrine';

import CustomAttributes from '../customAttributes';

let inputProps = {};

const Component = () => {
    return <CustomAttributes {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        customAttributes: []
    };
};

const givenCustomAttributes = () => {
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

    it('renders with custom attributes not visible on front', () => {
        inputProps = {
            customAttributes: [
                {
                    attribute_metadata: {
                        is_visible_on_front: false,
                        sort_order: 2
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: false,
                        sort_order: 1
                    }
                }
            ]
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders with custom attributes visible on front', () => {
        inputProps = {
            customAttributes: [
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Attribute 2',
                        sort_order: 2,
                        uid: 'uid-2'
                    },
                    entered_attribute_value: {
                        value: 'Option 3'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Attribute 1',
                        sort_order: 1,
                        uid: 'uid-1'
                    },
                    selected_attribute_options: {
                        attribute_option: [
                            {
                                label: 'Option 1'
                            },
                            {
                                label: 'Option 2'
                            }
                        ]
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Attribute 3',
                        sort_order: 3,
                        uid: 'uid-3'
                    },
                    selected_attribute_options: {
                        attribute_option: []
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: false,
                        sort_order: 4
                    }
                }
            ]
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
