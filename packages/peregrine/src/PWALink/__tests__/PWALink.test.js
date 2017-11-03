import makePWALink from '../';
import React from 'react';
import { Route, Link, MemoryRouter } from 'react-router-dom';
import enzyme from 'enzyme';
import ReactAdapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new ReactAdapter() });

const PWALink = makePWALink(Link);
test('should render a Link', () => {
    const wrapper = enzyme.shallow(<PWALink />);
    expect(wrapper.is(Link)).toBe(true);
});

test('should render passed-in children', () => {
    const wrapper = enzyme.shallow(<PWALink>Hello World</PWALink>);
    const children = wrapper
        .find(Link)
        .children()
        .text();
    expect(children).toBe('Hello World');
});

test("when 'to' prop is passed in, it should render a 'pathname' property in the 'to' prop", () => {
    const wrapper = enzyme.shallow(<PWALink to="/foobar" />);
    const pathname = wrapper.find(Link).prop('to').pathname;
    expect(pathname).toBe('/foobar');
});

test("when 'entityID' and 'entityType' prop are passed in, it should render both to the 'to' prop as properties", () => {
    const wrapper = enzyme.shallow(<PWALink entityType="foo" entityID="bar" />);
    const state = wrapper.find(Link).prop('to').state;
    expect(state.entityType).toBe('foo');
    expect(state.entityID).toBe('bar');
});
