import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Button from '../../../Button';
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

test('handles continue button click', () => {
    const { onContinue } = props;
    const { root } = createTestInstance(
        <FormSubmissionSuccessful {...props} />
    );

    root.findByType(Button).props.onClick();

    expect(onContinue).toHaveBeenCalledTimes(1);
});
