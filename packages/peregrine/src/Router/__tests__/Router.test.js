import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';

import MagentoRouter, { Consumer as RouteConsumer } from '../Router';

configure({ adapter: new Adapter() });

const __tmp_webpack_public_path__ = 'https://store.com/pub';
const apiBase = 'https://store.com';
const config = { apiBase, __tmp_webpack_public_path__ };

const initialEntries = ['/some-product.html'];
const routerProps = { initialEntries };

test('renders a single, catch-all route', () => {
    const routesWrapper = shallow(
        <MagentoRouter using={MemoryRouter} config={config} />
    ).find('Route');
    expect(routesWrapper.length).toBe(1);
    expect(
        routesWrapper.filterWhere(n => n.prop('path') === undefined).length
    ).toBe(1);
});

test('passes `config` and route props to context provider', () => {
    const fn = jest.fn();
    const props = { config, using: MemoryRouter };

    // we need to test context consumer, so we can't shallow render
    mount(
        <MagentoRouter {...props}>
            <RouteConsumer>{fn}</RouteConsumer>
        </MagentoRouter>
    );

    expect(fn).toHaveBeenCalledWith(
        expect.objectContaining({
            apiBase,
            __tmp_webpack_public_path__,
            history: expect.anything(), // from Route
            location: expect.anything(), // from Route
            match: expect.anything() // from Route
        })
    );
});

test('passes `routerProps` to router, not context provider', () => {
    const fn = jest.fn();
    const props = { config, routerProps, using: MemoryRouter };

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
