import React from 'react';
import { shallow } from 'enzyme';

import fromRenderProp, { filterProps } from '../fromRenderProp';

test('returns a component', () => {
    const Div = fromRenderProp('div');

    expect(Div).toBeInstanceOf(Function);
});

test('returns a basic component that renders', () => {
    const Div = fromRenderProp('div');
    const wrapper = shallow(<Div>foo</Div>);

    expect(wrapper.prop('children')).toBe('foo');
});

test('returns a composite component that renders', () => {
    const Foo = props => <div {...props} />;
    const WrappedFoo = fromRenderProp(Foo);
    const wrapper = shallow(<WrappedFoo>foo</WrappedFoo>);

    expect(wrapper.prop('children')).toBe('foo');
});

test('excludes custom props for a basic component', () => {
    const Div = fromRenderProp('div', ['foo']);
    const wrapper = shallow(<Div foo="bar" />);

    expect(wrapper.prop('foo')).toBeUndefined();
});

test('includes custom props for a composite component', () => {
    const Foo = props => <div {...props} />;
    const WrappedFoo = fromRenderProp(Foo, ['foo']);
    const wrapper = shallow(<WrappedFoo foo="bar" />);

    expect(wrapper.prop('foo')).toBe('bar');
});

test('`filterProps` returns an object', () => {
    expect(filterProps()).toEqual({});
});

test('`filterProps` filters properties from an object', () => {
    const input = { a: 0, b: 1 };
    const output = { b: 1 };
    const excludedProps = ['a'];

    expect(filterProps(input, excludedProps)).toEqual(output);
});
