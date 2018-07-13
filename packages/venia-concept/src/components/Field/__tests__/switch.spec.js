import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Switch from '../switch';

configure({ adapter: new Adapter() });

const classes = {
    root: 'abc'
};

const singleRadioProps = {
    name: 'color',
    type: 'radio',
    value: 'red'
};

test('renders an input', () => {
    const props = { ...singleRadioProps };
    const wrapper = shallow(<Switch {...props} />);

    expect(wrapper.type()).toEqual('input');
});

test('applies props correctly', () => {
    const props = { classes, ...singleRadioProps };
    const wrapper = shallow(<Switch {...props} data-id="a" />);

    expect(wrapper.props()).toMatchObject(singleRadioProps);
    expect(wrapper.prop('className')).toEqual(classes.root);
    expect(wrapper.prop('data-id')).toEqual('a');
    expect(wrapper.prop('onChange')).toBeInstanceOf(Function);
    expect(wrapper.props()).not.toHaveProperty('classes');
});

test('calls `onChange` on change', () => {
    const onChange = jest.fn();
    const props = { ...singleRadioProps, onChange };
    const wrapper = shallow(<Switch {...props} />);
    const target = { ...singleRadioProps, checked: true };

    wrapper.simulate('change', { target });
    expect(onChange).toHaveBeenCalledWith(
        target.name,
        target.value,
        target.checked
    );
});

test('does not call `onChange` if not provided', () => {
    const onChange = jest.fn();
    const props = { ...singleRadioProps };
    const wrapper = shallow(<Switch {...props} />);
    const target = { ...singleRadioProps, checked: true };

    wrapper.simulate('change', { target });
    expect(onChange).not.toHaveBeenCalled();
});
