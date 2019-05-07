import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { RouteProvider } from '../../Router';
import Page from '../Page';

jest.mock('../../Router/MagentoRouteHandler');

const context = { one: 1 };
const using = { Router, Route };

test('renders `MagentoRouteHandler` with context as props', () => {
    // we need to test context consumer, so we can't shallow render
    const wrapper = mount(
        <RouteProvider value={context}>
            <Page using={using} />
        </RouteProvider>
    );

    expect(wrapper.find('MagentoRouteHandler').props()).toEqual({
        ...context,
        using
    });
});

test('passes props to `MagentoRouteHandler`', () => {
    const props = { two: 2, using };

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
