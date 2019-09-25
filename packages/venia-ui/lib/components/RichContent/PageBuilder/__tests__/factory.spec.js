import { createTestInstance } from '@magento/peregrine';
import ContentTypeFactory from '../factory';
import * as config from '../config';
import React from 'react';

test('factory should render instance of content type', () => {
    const props = {
        data: {
            contentType: 'test',
            children: []
        }
    };
    const TestComponent = () => <div>Test Component</div>;
    config.default = jest.fn().mockImplementation(contentType => {
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
        <div>
            Parent Component<div>{children}</div>
        </div>
    );
    const ChildComponent = () => <div>Child Component</div>;
    config.default = jest.fn().mockImplementation(contentType => {
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

test("factory should render Missing for content types that aren't supported", () => {
    const props = {
        data: {
            contentType: 'broken',
            children: []
        }
    };
    const MissingComponent = () => <div>Missing Component</div>;
    config['MissingComponent'] = MissingComponent;
    const component = createTestInstance(<ContentTypeFactory {...props} />);
    expect(component.root.findByType(MissingComponent)).toBeTruthy();
});
