import React from 'react';
import { shallow } from 'enzyme';
import Input from '../input';

const validInput = {
    value: 'example value',
    placeholder: 'Enter username here',
    label: 'Username',
    type: 'Text',
    disabled: false,
    required: false,
    helpText: 'example help text',
    helpVisible: true,
    errorVisible: true,
    successVisible: true,
    onChange: null,
    field: 'value'
};

test('correctly assigns all props passed to `input` field', () => {
    const wrapper = shallow(
        <Input
            label={validInput.label}
            type={validInput.type}
            disabled={validInput.disabled}
            placeholder={validInput.placeholder}
            required={validInput.required}
            field={validInput.field}
        />
    );

    const wrapperProps = wrapper
        .dive()
        .find('Text')
        .props();

    const typeProp = wrapperProps.type;
    expect(typeProp).toEqual(validInput.type);

    const disabledProp = wrapperProps.disabled;
    expect(disabledProp).toEqual(validInput.disabled);

    const placeholderProp = wrapperProps.placeholder;
    expect(placeholderProp).toEqual(validInput.placeholder);

    const requiredProp = wrapperProps.required;
    expect(requiredProp).toEqual(validInput.required);
});

test('displays `helpText` when `helpVisible`', () => {
    const wrapper = shallow(
        <Input
            label={validInput.label}
            helpText={validInput.helpText}
            helpVisible={validInput.helpVisible}
            field={validInput.field}
        />
    ).dive();

    const helpText = shallow(wrapper.instance().helpText);
    expect(helpText.html()).toContain(validInput.helpText);
});

test('set `value` state when text is entered into `input`', () => {
    const changeValue = 'foo';
    const event = {
        preventDefault() {},
        target: { value: changeValue }
    };

    const wrapper = shallow(
        <Input label={validInput.label} field={validInput.field} />
    ).dive();

    wrapper.find('Text').prop('onChange')(event);
    expect(wrapper.state().value).toBe(changeValue);
});

test('set state to `focused` on `Text` focus', () => {
    const wrapper = shallow(
        <Input label={validInput.label} field={validInput.field} />
    ).dive();

    expect(wrapper.state().focused).toBeFalsy();
    wrapper.find('Text').simulate('focus');
    expect(wrapper.state().focused).toBeTruthy();
});
