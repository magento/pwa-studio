import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import FormSubmissionSuccessful from '../formSubmissionSuccessful';

jest.mock('../../../../classify');
jest.mock('../../../Button', () => () => <i />);

const props = {
    defaultMessage:
        'If there is an account associated with your email address, you will receive an email with a link to change your password.',
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

    expect(text.children[0]).toEqual(
        expect.stringContaining(props.defaultMessage)
    );
});
