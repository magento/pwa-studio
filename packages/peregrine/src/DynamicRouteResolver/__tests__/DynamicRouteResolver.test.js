import makeDynamicRouteResolver from '../';
import React from 'react';
import { Route, Link, MemoryRouter } from 'react-router-dom';
import enzyme from 'enzyme';
import ReactAdapter from 'enzyme-adapter-react-16';
import Page200 from '../__mocks__/200';
import Page404 from '../__mocks__/404';

enzyme.configure({ adapter: new ReactAdapter() });

const entityPageMap = {
    '200': Page200,
    '404': Page404
};

const DynamicRouteResolver = makeDynamicRouteResolver(entityPageMap);

test('When passed in an unrecognized entityType, should render Page404 component', () => {
    const location = {
        state: {
            entityID: 'foo',
            entityType: 'bar'
        }
    };
    const wrapper = enzyme.shallow(
        <DynamicRouteResolver location={location} />
    );
    expect(wrapper.is(Page404)).toBe(true);
});

test('When passed in no entityType, should render Page404 component', () => {
    const location = {
        entityID: 'foo'
    };
    const wrapper = enzyme.shallow(
        <DynamicRouteResolver location={location} />
    );
    expect(wrapper.is(Page404)).toBe(true);
});

test("When passed in a recognized entityType, should render 'entityID' and 'entityType' props to routed component", () => {
    const location = {
        state: {
            entityID: 1,
            entityType: '200'
        }
    };
    const wrapper = enzyme.shallow(
        <DynamicRouteResolver location={location} />
    );
    const expectedProps = { entityID: 1, entityType: '200' };
    expect(wrapper.props()).toEqual(expectedProps);
});

test('When passed in a recognized entityType, should render recognized types component', () => {
    const location = {
        state: {
            entityType: '200'
        }
    };
    const wrapper = enzyme.shallow(
        <DynamicRouteResolver location={location} />
    );
    expect(wrapper.is(Page200)).toBe(true);
});
