import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Options from '../options';
import { miniTiles } from '../mock_data';

configure({ adapter: new Adapter() });

const classes = {
    option: 'a',
    root: 'b'
};

test('selected when clicked', async () => {
    const mock = jest.fn;
    let wrapper = mount(
        <Options options={miniTiles} classes={classes} onSelect={mock} />
    );
    const componentInstance = wrapper
        .childAt(0) // could also be .find(Foo)
        .instance();
    wrapper
        .find('.a')
        .first()
        .simulate('click');
    expect(componentInstance.state.selected).toBe(0);
});

test('deselelects on second click', async () => {
    const mock = jest.fn;
    let wrapper = mount(
        <Options options={miniTiles} classes={classes} onSelect={mock} />
    );
    const componentInstance = wrapper
        .childAt(0) // could also be .find(Foo)
        .instance();
    wrapper
        .find('.a')
        .first()
        .simulate('click');
    wrapper
        .find('.a')
        .first()
        .simulate('click');
    expect(componentInstance.state.selected).toBe(null);
});
