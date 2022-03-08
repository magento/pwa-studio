import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import Textarea from '../textarea';

jest.mock('@magento/venia-ui/lib/components/RichContent', () => {
    return props => <mock-RichContent {...props} />;
});

let inputProps = {};

const Component = () => {
    return <Textarea {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        attribute_metadata: {
            label: 'Textarea Label'
        }
    };
};

describe('#Textarea', () => {
    it('renders empty when no data is provided', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders label only when data is missing', () => {
        givenDefaultValues();
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders textarea without html when data is provided', () => {
        inputProps = {
            attribute_metadata: {
                label: 'Textarea Label',
                ui_input: {
                    is_html_allowed: false
                }
            },
            entered_attribute_value: {
                value: 'Textarea'
            }
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders textarea with html when data is provided', () => {
        inputProps = {
            attribute_metadata: {
                label: 'Textarea Label',
                ui_input: {
                    is_html_allowed: true
                }
            },
            entered_attribute_value: {
                value: '<div>Textarea</div>'
            }
        };

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
