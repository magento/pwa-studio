import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Form from '../form';

jest.mock('../../../classify');
jest.mock('../editableForm', () => 'EditableForm');
jest.mock('../overview', () => 'Overview');

const defaultProps = {
    classes: {
        root: 'root'
    }
};

test('renders an overview Form component if not editing', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

// TODO: To actually test this we would have to mock useState.
test.skip('renders an editable Form component if editing', () => {
    const props = {
        ...defaultProps,
        editing: 'address'
    };
    const component = createTestInstance(<Form {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
