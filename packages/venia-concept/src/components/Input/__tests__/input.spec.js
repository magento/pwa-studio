import React from 'react';
import { configure, shallow } from 'enzyme';
import { BasicText } from 'informed';
import Adapter from 'enzyme-adapter-react-16';
import { Input } from '../input';

configure({ adapter: new Adapter() });

const helpType = 'hint';
const classes = {
    resetInput: 'resetInput',
    hint: helpType
};

const validInputProps = {
    initialValue: 'example initial value',
    fieldState: {
        value: 'example value'
    },
    placeholder: 'Enter username here',
    label: 'Username',
    type: 'Text',
    disabled: false,
    required: false,
    helpText: 'example help text',
    helpType,
    onChange: () => null,
    onFocus: () => null,
    onBlur: () => null,
    field: 'value',
    selected: false,
    validate: () => null,
    validateOnChange: true,
    classes
};

test('correctly assigns all props passed to `input` field', () => {
    const wrapper = shallow(<Input {...validInputProps} />);
    const wrapperProps = wrapper.find(BasicText).props();

    const typeProp = wrapperProps.type;
    expect(typeProp).toEqual(validInputProps.type);

    const disabledProp = wrapperProps.disabled;
    expect(disabledProp).toEqual(validInputProps.disabled);

    const placeholderProp = wrapperProps.placeholder;
    expect(placeholderProp).toEqual(validInputProps.placeholder);

    const initialValueProp = wrapperProps.initialValue;
    expect(initialValueProp).toEqual(validInputProps.initialValue);
});

test('displays `helpText` when it has been passed', () => {
    const wrapper = shallow(<Input {...validInputProps} />);

    expect(wrapper.find(`.${classes[helpType]}`)).toHaveLength(1);
});

test('set state to `focused` on `Text` focus', () => {
    const wrapper = shallow(<Input {...validInputProps} />);

    expect(wrapper.state().focused).toBeFalsy();
    wrapper.find(BasicText).simulate('focus');
    expect(wrapper.state().focused).toBeTruthy();
});

test('display reset button only when text has been typed in input', () => {
    const wrapperFilled = shallow(<Input {...validInputProps} />);
    expect(wrapperFilled.find(`.${classes.resetInput}`)).toHaveLength(1);

    const wrapperEmpty = shallow(
        <Input {...validInputProps} fieldState={{ value: '' }} />
    );
    expect(wrapperEmpty.find(`.${classes.resetInput}`)).toHaveLength(0);
});
