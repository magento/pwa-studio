import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Input from '../input';

configure({ adapter: new Adapter() });

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
    onChange: null
};

test('correctly assigns all props passed to `input` field', () => {
    const wrapper = shallow(
        <Input
            value={validInput.value}
            label={validInput.label}
            type={validInput.type}
            disabled={validInput.disabled}
            placeholder={validInput.placeholder}
            required={validInput.required}
        />
    );

    const wrapperProps = wrapper
        .dive()
        .find('input')
        .props();

    const valueProp = wrapperProps.value;
    expect(valueProp).toEqual(validInput.value);

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

    const wrapper = shallow(<Input label={validInput.label} />).dive();

    wrapper.find('input').prop('onChange')(event);
    expect(wrapper.state().value).toBe(changeValue);
});

test('call `makeDirty` and set state to dirty when `input` is blurred', () => {
    const wrapper = shallow(<Input label={validInput.label} />).dive();

    const makeDirtySpy = jest.spyOn(wrapper.instance(), 'makeDirty');

    expect(wrapper.state().dirty).toBeFalsy();
    wrapper.find('input').simulate('blur');
    expect(makeDirtySpy).toHaveBeenCalled();
    expect(wrapper.state().dirty).toBeTruthy();
});

test('set state to `focused` on `input` focus', () => {
    const wrapper = shallow(<Input label={validInput.label} />).dive();

    expect(wrapper.state().focused).toBeFalsy();
    wrapper.find('input').simulate('focus');
    expect(wrapper.state().focused).toBeTruthy();
});
