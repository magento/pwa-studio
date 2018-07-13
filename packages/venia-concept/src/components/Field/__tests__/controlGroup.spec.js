import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ControlGroup from '../controlGroup';

configure({ adapter: new Adapter() });

const colors = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' }
];

const colorProps = {
    options: colors,
    type: 'radio',
    value: ['blue']
};

test('derives state from props', () => {
    const props = { ...colorProps };
    const wrapper = shallow(<ControlGroup {...props} />);
    const checkedValues = wrapper.state('checkedValues');

    expect(colorProps.value.length).toEqual(checkedValues.size);
    expect(colorProps.value.every(v => checkedValues.has(v))).toBeTruthy;
});

test('renders a div', () => {
    const props = { ...colorProps };
    const wrapper = shallow(<ControlGroup {...props} />);

    expect(wrapper.type()).toEqual('div');
});

test('renders a child for each option', () => {
    const props = { ...colorProps };
    const wrapper = shallow(<ControlGroup {...props} />);

    expect(wrapper.children()).toHaveLength(colorProps.options.length);
});

test('renders each option as a labeled switch', () => {
    const props = { ...colorProps };
    const wrapper = shallow(<ControlGroup {...props} />);

    wrapper.children().forEach(node => {
        expect(node.type()).toEqual('label');
        expect(node.childAt(1).name()).toEqual('Switch');
    });
});

test('applies props to each option correctly', () => {
    const props = { ...colorProps, name: 'color' };
    const wrapper = shallow(<ControlGroup {...props} />);
    const checkedValues = wrapper.state('checkedValues');

    wrapper.children().forEach(node => {
        const input = node.childAt(1);

        expect(input.prop('name')).toEqual(props.name);
        expect(input.prop('type')).toEqual(props.type);
        expect(input.prop('onChange')).toEqual(wrapper.instance().handleChange);
        expect(input.prop('value')).toEqual(node.key());
        expect(input.prop('checked')).toEqual(checkedValues.has(node.key()));
    });
});

test('`handleChange` calls onChange on radio select', () => {
    const onChange = jest.fn();
    const props = { ...colorProps, onChange };
    const wrapper = shallow(<ControlGroup {...props} />);
    const changeArgs = ['color', 'red', true];

    wrapper.instance().handleChange(...changeArgs);

    expect(onChange).toHaveBeenCalledWith(changeArgs[0], expect.any(Set));
    expect(onChange.mock.calls[0][1].size).toBe(1);
    expect(onChange.mock.calls[0][1]).toContain('red');
});

test('`handleChange` calls onChange on checkbox select', () => {
    const onChange = jest.fn();
    const props = { ...colorProps, onChange, type: 'checkbox' };
    const wrapper = shallow(<ControlGroup {...props} />);
    const changeArgs = ['color', 'red', true];

    wrapper.instance().handleChange(...changeArgs);

    expect(onChange).toHaveBeenCalledWith(changeArgs[0], expect.any(Set));
    expect(onChange.mock.calls[0][1].size).toBe(2);
    expect(onChange.mock.calls[0][1]).toContain('red');
    expect(onChange.mock.calls[0][1]).toContain('blue');
});

test('`handleChange` calls onChange on checkbox deselect', () => {
    const onChange = jest.fn();
    const props = { ...colorProps, onChange, type: 'checkbox' };
    const wrapper = shallow(<ControlGroup {...props} />);
    const changeArgs = ['color', 'blue', false];

    wrapper.instance().handleChange(...changeArgs);

    expect(onChange).toHaveBeenCalledWith(changeArgs[0], expect.any(Set));
    expect(onChange.mock.calls[0][1].size).toBe(0);
});
