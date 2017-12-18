import Router from '..';
import { createElement } from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import UnknownRouteResolver from '../UnknownRouteResolver';

configure({ adapter: new Adapter() });

const routes = [
    {
        urlPattern: '/catalog/product/view/id/:id',
        getComponent: () => () => <div>Foo Bar</div>
    }
];
const render404 = () => <div>404</div>;
const renderLoading = () => <div>Loading</div>;
const renderRouteError = () => <div>Error</div>;
const noop = () => {};
const defaultTestProps = {
    Router: MemoryRouter,
    routes,
    renderLoading,
    render404,
    renderRouteError,
    resolveUnknownRoute: noop
};

test('Renders a `Route` component for a supplied route', () => {
    const wrapper = shallow(<Router {...defaultTestProps} />);
    const route = wrapper.find('Route[path="/catalog/product/view/id/:id"]');
    expect(route.length).toBe(1);
});

test('Renders the UnknownRouteResolver as the last route, with no path', () => {
    const wrapper = shallow(<Router {...defaultTestProps} />);
    const lastRoute = wrapper.find('Route').last();
    expect(lastRoute.props().path).toBeUndefined();
    const renderedTree = lastRoute.props().render({});
    expect(renderedTree.type).toBe(UnknownRouteResolver);
});

test('Navigating to a known route renders its associated component', cb => {
    const wrapper = mount(
        <Router
            {...defaultTestProps}
            routerProps={{
                initialEntries: ['/catalog/product/view/id/1'],
                initialIndex: 0
            }}
        />
    );
    process.nextTick(() => {
        expect(wrapper.render().toString()).toEqual('<div>Foo Bar</div>');
        cb();
    });
});

test('Result of renderLoading() rendered during route transition', () => {
    const wrapper = shallow(
        <Router
            {...defaultTestProps}
            routerProps={{
                initialEntries: ['/catalog/product/view/id/1'],
                initialIndex: 0
            }}
        />
    );
    expect(wrapper.render().toString()).toEqual('<div>Loading</div>');
});

test('Unknown routes can be lazily registered through "resolveUnknownRoute" fn prop', cb => {
    const resolveUnknownRoute = jest.fn(() =>
        Promise.resolve('/catalog/product/view/id/1')
    );
    const wrapper = mount(
        <Router
            {...defaultTestProps}
            routerProps={{
                initialEntries: ['/my-cool-product.html'],
                initialIndex: 0
            }}
            resolveUnknownRoute={resolveUnknownRoute}
        />
    );
    expect(resolveUnknownRoute).toHaveBeenCalledWith('/my-cool-product.html');
    process.nextTick(() => {
        expect(wrapper.render().toString()).toEqual('<div>Foo Bar</div>');
        cb();
    });
});

test('Unknown routes not found with "resolveUnknownRoute" render 404', cb => {
    // Current test case assumes that the GraphQLAPI we get will to use in `resolveUnknownRoute`
    // will return an empty string when it can't find a match. This will likely change,
    // and so will this code
    const resolveUnknownRoute = () => Promise.resolve('');
    const wrapper = mount(
        <Router
            {...defaultTestProps}
            routerProps={{
                initialEntries: ['/mystery-path.html'],
                initialIndex: 0
            }}
            resolveUnknownRoute={resolveUnknownRoute}
        />
    );
    process.nextTick(() => {
        expect(wrapper.render().toString()).toEqual('<div>404</div>');
        cb();
    });
});

test('Unknown routes that cause "resolveUnknownRoute" to reject render the error page', cb => {
    const resolveUnknownRoute = () => Promise.reject(new Error('some error'));
    const wrapper = mount(
        <Router
            {...defaultTestProps}
            routerProps={{
                initialEntries: ['/mystery-path.html'],
                initialIndex: 0
            }}
            resolveUnknownRoute={resolveUnknownRoute}
        />
    );
    process.nextTick(() => {
        expect(wrapper.render().toString()).toEqual('<div>Error</div>');
        cb();
    });
});

test('"getComponent" on a route def can return a component synchronously', cb => {
    const routes = [
        {
            urlPattern: '/my-cool-product.html',
            getComponent: () => () => <div>Foo Bar</div>
        }
    ];
    const wrapper = mount(
        <Router
            {...defaultTestProps}
            routerProps={{
                initialEntries: ['/my-cool-product.html'],
                initialIndex: 0
            }}
            routes={routes}
        />
    );
    process.nextTick(() => {
        expect(wrapper.render().toString()).toEqual('<div>Foo Bar</div>');
        cb();
    });
});

test('"getComponent" on a route def can return a promise resolving to a comp', cb => {
    const routes = [
        {
            urlPattern: '/my-cool-product.html',
            getComponent: () => Promise.resolve(() => <div>Foo Bar</div>)
        }
    ];
    const wrapper = mount(
        <Router
            {...defaultTestProps}
            routerProps={{
                initialEntries: ['/my-cool-product.html'],
                initialIndex: 0
            }}
            routes={routes}
        />
    );
    process.nextTick(() => {
        expect(wrapper.render().toString()).toEqual('<div>Foo Bar</div>');
        cb();
    });
});

test('Renders result of "renderRouteError" when the fetching of a Component rejects', cb => {
    const routes = [
        {
            urlPattern: '/my-cool-product.html',
            getComponent: () => Promise.reject(new Error('some error'))
        }
    ];
    const wrapper = mount(
        <Router
            {...defaultTestProps}
            routerProps={{
                initialEntries: ['/my-cool-product.html'],
                initialIndex: 0
            }}
            routes={routes}
        />
    );
    process.nextTick(() => {
        expect(wrapper.render().toString()).toEqual('<div>Error</div>');
        cb();
    });
});

test('Renders result of "renderRouteError" when "resolveUnknownRoute" rejects', cb => {
    const resolveUnknownRoute = jest.fn(() =>
        Promise.reject(new Error('some error'))
    );
    const wrapper = mount(
        <Router
            {...defaultTestProps}
            resolveUnknownRoute={resolveUnknownRoute}
        />
    );
    process.nextTick(() => {
        expect(wrapper.render().toString()).toEqual('<div>Error</div>');
        cb();
    });
});
