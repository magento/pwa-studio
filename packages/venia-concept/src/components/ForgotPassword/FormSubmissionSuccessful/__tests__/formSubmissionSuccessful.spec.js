import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from 'src/components/Button';
import FormSubmissionSuccessful from '../formSubmissionSuccessful';

configure({ adapter: new Adapter() });

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
