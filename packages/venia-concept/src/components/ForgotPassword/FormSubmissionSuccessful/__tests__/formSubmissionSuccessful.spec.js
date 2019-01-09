import React from 'react';
import { shallow } from 'enzyme';

import Button from 'src/components/Button';
import FormSubmissionSuccessful from '../formSubmissionSuccessful';

const classes = {
    text: 'text'
};
const email = 'test@example.com';

test('renders correctly', () => {
    const wrapper = shallow(
        <FormSubmissionSuccessful
            classes={classes}
            email={email}
            onContinue={() => {}}
        />
    ).dive();

    expect(wrapper.find(`.${classes.text}`)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
});

test('text message contains email', () => {
    const wrapper = shallow(
        <FormSubmissionSuccessful
            classes={classes}
            email={email}
            onContinue={() => {}}
        />
    ).dive();

    expect(wrapper.find(`.${classes.text}`).text()).toEqual(
        expect.stringContaining(email)
    );
});

test('handles continue button click', () => {
    const onContinue = jest.fn();

    const wrapper = shallow(
        <FormSubmissionSuccessful
            classes={classes}
            email={email}
            onContinue={onContinue}
        />
    ).dive();
    wrapper.find(Button).simulate('click');

    expect(onContinue).toBeCalled();
});
