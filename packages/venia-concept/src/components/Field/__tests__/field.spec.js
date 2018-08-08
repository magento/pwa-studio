import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Field from '../field';

configure({ adapter: new Adapter() });

test('renders a div by default', () => {
    const children = 'abc';
    const wrapper = shallow(<Field>{children}</Field>);

    expect(wrapper.type()).toEqual('div');
});

test('renders a label when `singular` is `true`', () => {
    const children = 'abc';
    const props = { children, singular: true };
    const wrapper = shallow(<Field {...props} />);

    expect(wrapper.type()).toEqual('label');
});

test('renders `label` as a span', () => {
    const props = { children: 'a', label: 'b' };
    const wrapper = shallow(<Field {...props} />).childAt(0);

    expect(wrapper.childAt(0).type()).toEqual('span');
    expect(wrapper.childAt(0).text()).toEqual(props.label);
});

test('renders `message` as a paragraph', () => {
    const props = { children: 'a', message: 'b' };
    const wrapper = shallow(<Field {...props} />).childAt(0);

    expect(wrapper.childAt(2).type()).toEqual('p');
    expect(wrapper.childAt(2).text()).toEqual(props.message);
});

test('renders `children` between label and message', () => {
    const props = { children: 'a' };
    const wrapper = shallow(<Field {...props} />).childAt(0);

    expect(wrapper.childAt(1).text()).toEqual(props.children);
});

test('renders `children` as provided', () => {
    const child = <span>abc</span>;
    const field = <Field>{child}</Field>;
    const wrapper = shallow(field).childAt(0);

    expect(wrapper.contains(child)).toBe(true);
});
