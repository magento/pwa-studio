import React from 'react';
import MagentoRouteHandler from '../MagentoRouteHandler';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
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

test('Does not re-fetch route that has already been seen', cb => {
    const RouteComponent = () => <div>I'm a route</div>;
    const SecondRouteComponent = () => <div>Other Route</div>;
    mockUnknownRouteResolverOnce();
    mockFetchRootComponentOnce(RouteComponent);
    const wrapper = shallow(
        <MagentoRouteHandler
            apiBase="https://site.com"
            location={{ pathname: '/foo.html' }}
            __tmp_webpack_public_path__="http://site.com/pub"
        />
    );
    wrapper.setState({
        // Populate state with a pre-visited route
        '/second-path.html': {
            Component: SecondRouteComponent
        }
    });
    process.nextTick(() => {
        wrapper.update();
        wrapper.setProps({
            // Navigate to page we've already seen
            location: { pathname: '/second-path.html' }
        });
        process.nextTick(() => {
            expect(resolveUnknownRoute).toHaveBeenCalledTimes(1);
            expect(wrapper.find(SecondRouteComponent).length).toBe(1);
            cb();
        });
    });
});
