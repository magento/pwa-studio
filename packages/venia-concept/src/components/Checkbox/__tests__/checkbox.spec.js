import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Checkbox from '../checkbox';

configure({ adapter: new Adapter() });

test('becomes checked and unchecked when clicked', () => {
    const wrapper = shallow(
        <Checkbox select={() => {}} initialState={false} />
    ).dive();

    wrapper.find('div').simulate('click');
    expect(wrapper.state().checked).toBeTruthy();
    wrapper.find('div').simulate('click');
    expect(wrapper.state().checked).toBeFalsy();
});

test('becomes focused and unfocused correctly', () => {
    const wrapper = shallow(
        <Checkbox select={() => {}} initialState={false} />
    ).dive();

    wrapper.find('div').simulate('focus');
    expect(wrapper.state().focused).toBeTruthy();
    wrapper.find('div').simulate('blur');
    expect(wrapper.state().focused).toBeFalsy();
});

test('handles click on keyup', () => {
    const wrapper = shallow(
        <Checkbox select={() => {}} initialState={false} />
    ).dive();

    const keyUpSpy = jest.spyOn(wrapper.instance(), 'handleClick');
    wrapper.find('div').simulate('keyUp', { key: 'Enter' });
    expect(keyUpSpy).toHaveBeenCalled();
    expect(wrapper.state().checked).toBeTruthy();
});
