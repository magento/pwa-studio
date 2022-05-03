import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import Text from '../text';

jest.mock('@magento/venia-ui/lib/components/RichContent', () => {
    return props => <mock-RichContent {...props} />;
});

let inputProps = {};

const Component = () => {
    return <Text {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        attribute_metadata: {
            label: 'Text Label'
        }
    };
};

describe('#Text', () => {
    it('renders empty when no data is provided', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders label only when data is missing', () => {
        givenDefaultValues();
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders text without html when data is provided', () => {
        inputProps = {
            attribute_metadata: {
                label: 'Text Label',
                ui_input: {
                    is_html_allowed: false
                }
            },
            entered_attribute_value: {
                value: 'Text'
            }
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders text with html when data is provided', () => {
        inputProps = {
            attribute_metadata: {
                label: 'Text Label',
                ui_input: {
                    is_html_allowed: true
                }
            },
            entered_attribute_value: {
                value: '<div>Text</div>'
            }
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
