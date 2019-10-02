import getContentTypeConfig from '../config';

test('can retrieve config for row content type which has component and aggregator', () => {
    const contentTypeConfig = getContentTypeConfig('row');
    expect(contentTypeConfig.configAggregator).toBeDefined();
    expect(contentTypeConfig.component).toBeDefined();
});
