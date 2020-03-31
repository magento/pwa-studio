import React from 'react';
import { getContentTypeConfig, setContentTypeConfig } from '../config';

jest.mock('@magento/venia-drivers', () => ({
    resourceUrl: jest.fn(url => url),
    withRouter: jest.fn(arg => arg)
}));

const dynamicContentType = 'dynamicContentType';
const dynamicContentTypeConfig = {
    configAggregator: jest.fn(),
    component: () => <div>Test Component</div>
};

test('can retrieve config for row content type which has component and aggregator', () => {
    const contentTypeConfig = getContentTypeConfig('row');
    expect(contentTypeConfig.configAggregator).toBeDefined();
    expect(contentTypeConfig.component).toBeDefined();
});

test('can set config for dynamic content type', () => {
    const contentTypeConfig = setContentTypeConfig(
        dynamicContentType,
        dynamicContentTypeConfig
    );
    expect(contentTypeConfig.configAggregator).toBeDefined();
    expect(contentTypeConfig.component).toBeDefined();
});

test('can get config for dynamic content type after it was set', () => {
    setContentTypeConfig(dynamicContentType, dynamicContentTypeConfig);
    const contentTypeConfig = getContentTypeConfig(dynamicContentType);
    expect(contentTypeConfig.configAggregator).toBeDefined();
    expect(contentTypeConfig.component).toBeDefined();
});
