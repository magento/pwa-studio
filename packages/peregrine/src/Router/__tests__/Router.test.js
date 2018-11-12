import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';

import MagentoRouter from '../Router';

jest.mock('FETCH_ROOT_COMPONENT', () => jest.fn(), { virtual: true });

configure({ adapter: new Adapter() });

const apiBase = 'https://store.com';

test('calls render routes function', () => {
    const renderRoutesMock = jest.fn();

    shallow(
        <MagentoRouter
            using={MemoryRouter}
            apiBase={apiBase}
            renderRoutes={renderRoutesMock}
        />
    );

    expect(renderRoutesMock).toBeCalled();
});

test('renderRoutes function receives magentoRoute as an argument', () => {
    const renderRoutesMock = jest.fn();

    shallow(
        <MagentoRouter
            using={MemoryRouter}
            apiBase={apiBase}
            renderRoutes={renderRoutesMock}
        />
    );

    expect(renderRoutesMock).toBeCalledWith(
        expect.objectContaining({
            magentoRoute: expect.any(Object)
        })
    );
});
