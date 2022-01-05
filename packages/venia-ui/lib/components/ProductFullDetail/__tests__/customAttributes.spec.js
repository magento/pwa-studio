import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import CustomAttributes from '../customAttributes';

jest.mock('react-intl', () => ({
    FormattedDate: props => <mock-FormattedDate {...props} />,
    FormattedMessage: ({ defaultMessage }) => defaultMessage,
    FormattedTime: props => <mock-FormattedTime {...props} />
}));

jest.mock('@magento/venia-ui/lib/components/Price', () => {
    return props => <mock-Price {...props} />;
});

jest.mock('@magento/venia-ui/lib/components/RichContent', () => {
    return props => <mock-RichContent {...props} />;
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
                        label: 'Boolean Attribute without data',
                        sort_order: 1,
                        uid: 'uid-1',
                        ui_input: {
                            ui_input_type: 'BOOLEAN'
                        }
                    },
                    entered_attribute_value: {}
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Date Attribute without data',
                        sort_order: 2,
                        uid: 'uid-2',
                        ui_input: {
                            ui_input_type: 'DATE'
                        }
                    },
                    entered_attribute_value: {}
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'DateTime Attribute without data',
                        sort_order: 3,
                        uid: 'uid-3',
                        ui_input: {
                            ui_input_type: 'DATETIME'
                        }
                    },
                    entered_attribute_value: {}
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Price Attribute without data',
                        sort_order: 4,
                        uid: 'uid-4',
                        ui_input: {
                            ui_input_type: 'PRICE'
                        }
                    },
                    entered_attribute_value: {}
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Select Attribute without options',
                        sort_order: 5,
                        uid: 'uid-5',
                        ui_input: {
                            ui_input_type: 'SELECT',
                            is_html_allowed: false
                        }
                    },
                    selected_attribute_options: {
                        attribute_option: []
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Text Attribute without data',
                        sort_order: 6,
                        uid: 'uid-6',
                        ui_input: {
                            ui_input_type: 'TEXT',
                            is_html_allowed: false
                        }
                    },
                    entered_attribute_value: {}
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Boolean Attribute',
                        sort_order: 7,
                        uid: 'uid-7',
                        ui_input: {
                            ui_input_type: 'BOOLEAN'
                        }
                    },
                    entered_attribute_value: {
                        value: 'Yes'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Date Attribute',
                        sort_order: 8,
                        uid: 'uid-8',
                        ui_input: {
                            ui_input_type: 'DATE'
                        }
                    },
                    entered_attribute_value: {
                        value: '2019-08-27 12:00:00'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'DateTime Attribute',
                        sort_order: 9,
                        uid: 'uid-9',
                        ui_input: {
                            ui_input_type: 'DATETIME'
                        }
                    },
                    entered_attribute_value: {
                        value: '2019-08-27 12:00:00'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Price Attribute',
                        sort_order: 9,
                        uid: 'uid-9',
                        ui_input: {
                            ui_input_type: 'PRICE'
                        }
                    },
                    entered_attribute_value: {
                        value: '100'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Select Attribute without html content',
                        sort_order: 10,
                        uid: 'uid-10',
                        ui_input: {
                            ui_input_type: 'SELECT',
                            is_html_allowed: false
                        }
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
                        label: 'Select Attribute with html content',
                        sort_order: 10,
                        uid: 'uid-10',
                        ui_input: {
                            ui_input_type: 'SELECT',
                            is_html_allowed: true
                        }
                    },
                    selected_attribute_options: {
                        attribute_option: [
                            {
                                label: '<span>Option 1</span>'
                            },
                            {
                                label: '<span>Option 2</span>'
                            }
                        ]
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Text Attribute without html content',
                        sort_order: 11,
                        uid: 'uid-11',
                        ui_input: {
                            ui_input_type: 'TEXT',
                            is_html_allowed: false
                        }
                    },
                    entered_attribute_value: {
                        value: 'Text'
                    }
                },
                {
                    attribute_metadata: {
                        is_visible_on_front: true,
                        label: 'Text Attribute with html content',
                        sort_order: 12,
                        uid: 'uid-12',
                        ui_input: {
                            ui_input_type: 'TEXT',
                            is_html_allowed: true
                        }
                    },
                    entered_attribute_value: {
                        value: '<div>Text</div>'
                    }
                }
            ]
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
