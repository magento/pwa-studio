import MagentoRouter from '../Router';
import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import resolveUnknownRoute from '../resolveUnknownRoute';
import fetchRootComponent from '../fetchRootComponent';

configure({ adapter: new Adapter() });

jest.mock('../fetchRootComponent', () => jest.fn());
jest.mock('../resolveUnknownRoute');

const mockUnknownRouteResolverOnce = () =>
    resolveUnknownRoute.mockReturnValueOnce(
        Promise.resolve({
            rootChunkID: 0,
            rootModuleID: 1,
            matched: true,
            id: 1
        })
    );

const mockFetchRootComponentOnce = Component =>
    fetchRootComponent.mockReturnValueOnce(Promise.resolve(Component));

test('Only rendered route is a catch-all', () => {
    const routesWrapper = shallow(
        <MagentoRouter
            using={MemoryRouter}
            apiBase="https://store.com"
            __tmp_webpack_public_path__="https://store.com/pub"
        />
    ).find('Route');
    expect(routesWrapper.length).toBe(1);
    expect(routesWrapper.prop('path')).toBeUndefined();
});

test('Renders component for matching route', cb => {
    mockUnknownRouteResolverOnce();
    const RouteComponent = () => <div>Route Component</div>;
    mockFetchRootComponentOnce(RouteComponent);
    const wrapper = mount(
        <MagentoRouter
            using={MemoryRouter}
            routerProps={{
                initialEntries: ['/some-product.html']
            }}
            apiBase="https://store.com"
            __tmp_webpack_public_path__="https://store.com/pub"
        />
    );

    process.nextTick(() => {
        wrapper.update();
        expect(wrapper.text()).toBe('Route Component');
        cb();
    });
});

test('Renders loading content before first route is resolved', () => {
    mockUnknownRouteResolverOnce();
    const RouteComponent = () => <div>Route Component</div>;
    mockFetchRootComponentOnce(RouteComponent);
    const wrapper = mount(
        <MagentoRouter
            using={MemoryRouter}
            routerProps={{
                initialEntries: ['/some-product.html']
            }}
            apiBase="https://store.com"
            __tmp_webpack_public_path__="https://store.com/pub"
        />
    );
    expect(wrapper.text()).toBe('Loading');
});

test('On route change, fetches and renders new route', cb => {
    mockUnknownRouteResolverOnce();
    const RouteComponent = () => <div>Route Component</div>;
    mockFetchRootComponentOnce(RouteComponent);
    const wrapper = mount(
        <MagentoRouter
            using={MemoryRouter}
            routerProps={{
                initialEntries: ['/some-product.html']
            }}
            apiBase="https://store.com"
            __tmp_webpack_public_path__="https://store.com/pub"
        />
    );

    mockUnknownRouteResolverOnce();
    const NewPage = () => <div>New Page</div>;
    mockFetchRootComponentOnce(NewPage);
    const { history } = wrapper.find('Router').props();
    history.push('/another-route.html');

    process.nextTick(() => {
        wrapper.update();
        expect(wrapper.text()).toBe('New Page');
        cb();
    });
});
