import { createTestInstance } from '@magento/peregrine';
import ContentTypeFactory from '../factory';
import * as config from '../config';
import React from 'react';

jest.mock('react-router-dom', () => ({
    withRouter: jest.fn(arg => arg)
}));
jest.mock('@magento/peregrine/lib/util/makeUrl');

test('factory should render instance of content type', () => {
    const props = {
        data: {
            contentType: 'test',
            children: []
        }
    };
    const TestComponent = () => <mock-TestComponent />;
    // eslint-disable-next-line no-import-assign
    config.getContentTypeConfig = jest.fn().mockImplementation(contentType => {
        if (contentType === 'test') {
            return {
                configAggregator: () => {},
                component: TestComponent
            };
        }
    });
    const component = createTestInstance(<ContentTypeFactory {...props} />);
    expect(component.root.findByType(TestComponent)).toBeTruthy();
});

test('factory should render all children content types', () => {
    const props = {
        data: {
            contentType: 'parent',
            children: [
                {
                    contentType: 'child',
                    children: []
                },
                {
                    contentType: 'child',
                    children: []
                },
                {
                    contentType: 'child',
                    children: []
                }
            ]
        }
    };
    const ParentComponent = ({ children }) => (
        <mock-ParentComponent>{children}</mock-ParentComponent>
    );
    const ChildComponent = () => <mock-ChildComponent />;
    // eslint-disable-next-line no-import-assign
    config.getContentTypeConfig = jest.fn().mockImplementation(contentType => {
        if (contentType === 'parent') {
            return {
                configAggregator: () => {
                    return {};
                },
                component: ParentComponent
            };
        }
        if (contentType === 'child') {
            return {
                configAggregator: () => {
                    return {};
                },
                component: ChildComponent
            };
        }
    });
    const component = createTestInstance(<ContentTypeFactory {...props} />);
    expect(component.root.findByType(ParentComponent)).toBeTruthy();
    expect(component.root.findAllByType(ChildComponent).length).toEqual(3);
});

test("factory should not render content types that aren't supported", () => {
    const props = {
        data: {
            contentType: 'broken',
            children: []
        }
    };
    const component = createTestInstance(<ContentTypeFactory {...props} />);
    expect(component.toJSON()).toEqual(null);
});

test('factory should not render hidden instance of a content type', () => {
    const props = {
        data: {
            contentType: 'test',
            isHidden: true,
            children: []
        }
    };
    const TestComponent = () => <mock-TestComponent />;
    // eslint-disable-next-line no-import-assign
    config['contentTypesConfig'] = {
        test: {
            configAggregator: () => {
                return {};
            },
            component: TestComponent
        }
    };
    const component = createTestInstance(<ContentTypeFactory {...props} />);
    expect(() => {
        component.root.findByType(TestComponent);
    }).toThrowError('No instances found with node type: "TestComponent"');
});
