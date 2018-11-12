import React from 'react';
import MagentoRouteHandler from '../MagentoRouteHandler';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import resolveUnknownRoute from '../resolveUnknownRoute';
import fetchRootComponent from 'FETCH_ROOT_COMPONENT';

jest.mock('FETCH_ROOT_COMPONENT', () => jest.fn(), { virtual: true });

configure({ adapter: new Adapter() });

jest.mock('../resolveUnknownRoute');

const apiBase = 'https://store.com';
const renderRoutingError = jest.fn();
const location = { pathname: '/foo.html' };

const props = { apiBase, renderRoutingError, location };

const resolvedRoute = {
    type: 'CMS_PAGE',
    id: 2
};

beforeEach(() => {
    renderRoutingError.mockClear();
});

afterEach(() => {
    resolveUnknownRoute.mockRestore();
    fetchRootComponent.mockRestore();
});

test('renders `loading` while loading', () => {
    shallow(<MagentoRouteHandler {...props} />);

    expect(renderRoutingError).toHaveBeenCalledTimes(1);
    expect(renderRoutingError).toHaveBeenNthCalledWith(1, {
        hasError: false,
        internalError: false,
        loading: true,
        notFound: false
    });
});

test('renders `null` while loading if `children` is not a function', () => {
    const localProps = { ...props };

    delete localProps.renderRoutingError;
    shallow(<MagentoRouteHandler {...localProps} />);

    expect(renderRoutingError).not.toHaveBeenCalled();
});

test('renders `internalError` if `resolveUnknownRoute` fails', async () => {
    resolveUnknownRoute.mockRejectedValue(new Error());
    shallow(<MagentoRouteHandler {...props} />);

    await Promise.resolve(); // resolveUnknownRoute

    expect(renderRoutingError).toHaveBeenCalledTimes(2);
    expect(renderRoutingError).toHaveBeenNthCalledWith(1, {
        hasError: false,
        internalError: false,
        loading: true,
        notFound: false
    });
    expect(renderRoutingError).toHaveBeenNthCalledWith(2, {
        hasError: true,
        internalError: true,
        loading: false,
        notFound: false
    });
});

test('renders `notFound` if resolved route is not matched', async () => {
    resolveUnknownRoute.mockResolvedValue({ matched: false });
    shallow(<MagentoRouteHandler {...props} />);

    await Promise.resolve(); // resolveUnknownRoute

    expect(renderRoutingError).toHaveBeenCalledTimes(2);
    expect(renderRoutingError).toHaveBeenNthCalledWith(1, {
        hasError: false,
        internalError: false,
        loading: true,
        notFound: false
    });
    expect(renderRoutingError).toHaveBeenNthCalledWith(2, {
        hasError: true,
        internalError: false,
        loading: false,
        notFound: true
    });
});

test('renders `internalError` if `fetchRootComponent` fails', async () => {
    resolveUnknownRoute.mockResolvedValue(resolvedRoute);
    fetchRootComponent.mockRejectedValue(new Error());

    const wrapper = shallow(<MagentoRouteHandler {...props} />);

    await Promise.resolve(); // resolveUnknownRoute
    await Promise.resolve(); // fetchRootComponent

    expect(wrapper.state('componentMap').size).toBe(1);
    expect(renderRoutingError).toHaveBeenCalledTimes(2);
    expect(renderRoutingError).toHaveBeenNthCalledWith(1, {
        hasError: false,
        internalError: false,
        loading: true,
        notFound: false
    });
    expect(renderRoutingError).toHaveBeenNthCalledWith(2, {
        hasError: true,
        internalError: true,
        loading: false,
        notFound: false
    });
});

test('renders RootComponent if `fetchRootComponent` succeeds', async () => {
    const RootComponent = () => <i />;

    resolveUnknownRoute.mockResolvedValue(resolvedRoute);
    fetchRootComponent.mockResolvedValue(RootComponent);

    const wrapper = shallow(<MagentoRouteHandler {...props} />);

    await Promise.resolve(); // resolveUnknownRoute
    await Promise.resolve(); // fetchRootComponent

    expect(renderRoutingError).toHaveBeenCalledTimes(1);
    expect(renderRoutingError).toHaveBeenNthCalledWith(1, {
        hasError: false,
        internalError: false,
        loading: true,
        notFound: false
    });
    expect(wrapper.find(RootComponent)).toHaveLength(1);
});

test('skips `fetchRootComponent` if path is known', async () => {
    const RootComponent = () => <i />;

    resolveUnknownRoute.mockResolvedValue(resolvedRoute);
    fetchRootComponent.mockResolvedValue(RootComponent);

    const wrapper = shallow(<MagentoRouteHandler {...props} />);

    await Promise.resolve(); // resolveUnknownRoute
    await Promise.resolve(); // fetchRootComponent

    // navigate to `bar`
    wrapper.setProps({ ...props, location: { pathname: '/bar.html' } });

    await Promise.resolve(); // resolveUnknownRoute
    await Promise.resolve(); // fetchRootComponent

    // navigate back to `foo`
    wrapper.setProps(props);

    await Promise.resolve(); // resolveUnknownRoute
    await Promise.resolve(); // fetchRootComponent

    expect(renderRoutingError).toHaveBeenCalledTimes(2);
    expect(fetchRootComponent).toHaveBeenCalledTimes(2);
    expect(wrapper.find(RootComponent)).toHaveLength(1);
});
