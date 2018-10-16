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

test('option is selected when clicked', async () => {
    const mock = jest.fn;
    let wrapper = mount(
        <Options options={miniTiles} classes={classes} onSelect={mock} />
    );
    const componentInstance = wrapper.childAt(0).instance();
    wrapper
        .find('.a')
        .first()
        .simulate('click');
    expect(componentInstance.state.selected).not.toBe(null);
});

test('option deselelects on second click', async () => {
    const mock = jest.fn;
    let wrapper = mount(
        <Options options={miniTiles} classes={classes} onSelect={mock} />
    );
    const componentInstance = wrapper.childAt(0).instance();
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

test('Emits a populated object on select', async () => {
    const mockCallBack = jest.fn(x => x);
    let wrapper = mount(
        <Options
            options={miniTiles}
            classes={classes}
            onSelect={mockCallBack}
        />
    );
    wrapper
        .find('.a')
        .first()
        .simulate('click');
    const attributeCode = miniTiles[0].attributeCode;
    expect(mockCallBack.mock.results[0].value[attributeCode]).toHaveProperty(
        'label'
    );
    expect(mockCallBack.mock.results[0].value[attributeCode]).toHaveProperty(
        'value_index'
    );
});

test('emits an empty object on deselect', async () => {
    const mockCallBack = jest.fn(x => x);
    let wrapper = mount(
        <Options
            options={miniTiles}
            classes={classes}
            onSelect={mockCallBack}
        />
    );
    wrapper
        .find('.a')
        .first()
        .simulate('click');
    wrapper
        .find('.a')
        .first()
        .simulate('click');
    const attributeCode = miniTiles[0].attributeCode;
    expect(mockCallBack.mock.results[1].value[attributeCode]).toMatchObject({});
});
