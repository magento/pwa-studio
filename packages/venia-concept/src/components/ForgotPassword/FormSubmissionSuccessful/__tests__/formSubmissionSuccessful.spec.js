import React from 'react';
import { configure, shallow } from 'enzyme';
import Button from 'src/components/Button/index';
import Adapter from 'enzyme-adapter-react-16';
import FormSubmissionSuccessful from '../formSubmissionSuccessful';

configure({ adapter: new Adapter() });

const classes = {
    text: 'text'
};

test('renders correctly', () => {
    const wrapper = shallow(
        <FormSubmissionSuccessful classes={classes} />
    ).dive();

    expect(wrapper.find(`.${classes.text}`)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
});

test('text message contains email', () => {
    const email = 'test@example.com';
    const wrapper = shallow(
        <FormSubmissionSuccessful classes={classes} email={email} />
    ).dive();

    expect(wrapper.find(`.${classes.text}`).text()).toEqual(
        expect.stringContaining(email)
    );
});

test('handles continue button click', () => {
    const onContinue = jest.fn();

    const wrapper = shallow(
        <FormSubmissionSuccessful classes={classes} onContinue={onContinue} />
    ).dive();
    wrapper.find(Button).simulate('click');

    expect(onContinue).toBeCalled();
});
