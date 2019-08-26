import React from 'react';
import { mount } from 'enzyme';

import { RouteProvider } from '../../Router';
import Page from '../';

jest.mock('../../Router/magentoRouteHandler');

const context = { one: 1 };

test('renders `MagentoRouteHandler` with context as props', () => {
    // we need to test context consumer, so we can't shallow render
    const wrapper = mount(
        <RouteProvider value={context}>
            <Page />
        </RouteProvider>
    );

    expect(wrapper.find('MagentoRouteHandler').props()).toEqual(context);
});

test('passes props to `MagentoRouteHandler`', () => {
    const props = { two: 2 };

    // we need to test context consumer, so we can't shallow render
    const wrapper = mount(
        <RouteProvider value={context}>
            <Page {...props} />
        </RouteProvider>
    );

    expect(wrapper.find('MagentoRouteHandler').props()).toEqual({
        ...props,
        ...context
    });
});
