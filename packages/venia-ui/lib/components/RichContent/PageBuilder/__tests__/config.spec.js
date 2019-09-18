import { contentTypesConfig } from '../config';

test('all content types contain component and aggregator', () => {
    for (const [, config] of Object.entries(contentTypesConfig)) {
        expect(config.configAggregator).toBeDefined();
        expect(config.component).toBeDefined();
    }
});
