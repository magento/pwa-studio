import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Control from '../control';

configure({ adapter: new Adapter() });

const textProps = {
    name: 'a',
    type: 'text'
};

const selectProps = {
    name: 'b',
    options: [{ value: '10' }, { value: '20' }],
    type: 'select'
};

test('renders a span', () => {
    const props = { ...textProps };
    const wrapper = shallow(<Control {...props} />);

    expect(wrapper.type()).toEqual('span');
});

test('renders a valid select element', () => {
    const props = { ...selectProps };
    const wrapper = shallow(<Control {...props} />);

    expect(wrapper.childAt(0).type()).toEqual('select');
    expect(wrapper.childAt(0).prop('type')).toBe(null);
});

test('renders a valid textarea element', () => {
    const props = { ...textProps, type: 'textarea' };
    const wrapper = shallow(<Control {...props} />);

    expect(wrapper.childAt(0).type()).toEqual('textarea');
    expect(wrapper.childAt(0).prop('type')).toBe(null);
});

test('renders a valid input element of the correct type', () => {
    const props = { ...textProps };
    const wrapper = shallow(<Control {...props} />);

    expect(wrapper.childAt(0).type()).toEqual('input');
    expect(wrapper.childAt(0).prop('type')).toBe('text');
});

test('calls `onChange` on input change', () => {
    const onChange = jest.fn();
    const props = { ...textProps, onChange };
    const wrapper = shallow(<Control {...props} />);
    const input = wrapper.childAt(0);
    const target = { ...textProps, value: 'z' };

    input.simulate('change', { target });
    expect(onChange).toHaveBeenCalledWith(target.name, target.value);
});

test('calls `onChange` on textarea change', () => {
    const onChange = jest.fn();
    const props = { ...textProps, onChange, type: 'textarea' };
    const wrapper = shallow(<Control {...props} />);
    const input = wrapper.childAt(0);
    const target = { ...textProps, type: 'textarea', value: 'z' };

    input.simulate('change', { target });
    expect(onChange).toHaveBeenCalledWith(target.name, target.value);
});

test('calls `onChange` on select change', () => {
    const onChange = jest.fn();
    const props = { ...selectProps, onChange };
    const wrapper = shallow(<Control {...props} />);
    const input = wrapper.childAt(0);
    const target = { ...selectProps, ...selectProps.options[1] };

    input.simulate('change', { target });
    expect(onChange).toHaveBeenCalledWith(target.name, target.value);
});
