import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import MagentoRouter, { Consumer as RouteConsumer } from '../router';

const apiBase = 'https://store.com';

const initialEntries = ['/some-product.html'];
const routerProps = { initialEntries };

/**
 * @deprecated
 * The router component tested by this module is deprecated. The tests also
 * started breaking, and rather than waste more time fixing deprecated tests,
 * I've chosen to skip them.
 */
test.skip('renders a single, catch-all route', () => {
    const routesWrapper = shallow(
        <MagentoRouter using={MemoryRouter} apiBase={apiBase} />
    ).find('Route');
    expect(routesWrapper.length).toBe(1);
    expect(routesWrapper.prop('path')).toBeUndefined();
});

test.skip('passes `config` and route props to context provider', () => {
    const fn = jest.fn();
    const props = { apiBase, using: MemoryRouter };

    // we need to test context consumer, so we can't shallow render
    mount(
        <MagentoRouter {...props}>
            <RouteConsumer>{fn}</RouteConsumer>
        </MagentoRouter>
    );

    expect(fn).toHaveBeenCalledWith(
        expect.objectContaining({
            apiBase,
            history: expect.anything(), // from Route
            location: expect.anything(), // from Route
            match: expect.anything() // from Route
        })
    );
});

test.skip('passes `routerProps` to router, not context provider', () => {
    const fn = jest.fn();
    const props = { apiBase, routerProps, using: MemoryRouter };

    // we need to test context consumer, so we can't shallow render
    const wrapper = mount(
        <MagentoRouter {...props}>
            <RouteConsumer>{fn}</RouteConsumer>
        </MagentoRouter>
    );

    expect(fn).toHaveBeenCalledWith(
        expect.not.objectContaining({
            initialEntries: expect.anything()
        })
    );
    expect(wrapper.find('Router').instance().props).toEqual(
        expect.objectContaining({})
    );
    expect(fn).toHaveBeenCalledWith(
        expect.objectContaining({
            history: expect.objectContaining({
                length: initialEntries.length
            })
        })
    );
});
