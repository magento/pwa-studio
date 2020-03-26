import getContentTypeConfig from '../config';

jest.mock('@magento/venia-drivers', () => ({
    resourceUrl: jest.fn(url => url),
    withRouter: jest.fn(arg => arg)
}));

test('can retrieve config for row content type which has component and aggregator', () => {
    const contentTypeConfig = getContentTypeConfig('row');
    expect(contentTypeConfig.configAggregator).toBeDefined();
    expect(contentTypeConfig.component).toBeDefined();
});
