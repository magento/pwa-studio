import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import FormSubmissionSuccessful from '../formSubmissionSuccessful';

jest.mock('../../../../classify');
jest.mock('../../../Button', () => () => <i />);

const props = {
    email: 'test@example.com',
    onContinue: jest.fn()
};

test('renders correctly', () => {
    const tree = createTestInstance(<FormSubmissionSuccessful {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('text message contains email', () => {
    const { root } = createTestInstance(
        <FormSubmissionSuccessful {...props} />
    );

    const text = root.findByProps({ className: 'text' });

    expect(text.children[0]).toEqual(expect.stringContaining(props.email));
});
