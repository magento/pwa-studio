import configAggregator from '../configAggregator';

test('dynamic block config aggregator does not render if widget block is not present', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="dynamic_block" data-appearance="default" data-element="main"></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0]);

    expect(aggregatedConfig).toEqual({});
});

test('dynamic block config aggregator does not render if no uids is found', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="dynamic_block" data-appearance="default" data-element="main"><div class="widget block block-banners" data-banner-id="1" data-types="" data-display-mode="fixed" data-ids="1" data-rotate="" data-store-id="1" data-banner-name="Block 1" data-banner-status="Enabled"></div></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0]);

    expect(aggregatedConfig).toEqual({});
});

test('dynamic block config aggregator retrieves data and display block', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="dynamic_block" data-appearance="default" data-element="main"><div class="widget block block-banners" data-banner-id="1" data-types="" data-display-mode="fixed" data-ids="1" data-rotate="" data-store-id="1" data-banner-name="Block 1" data-banner-status="Enabled" data-uids="uids"></div></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0]);

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            displayInline: false,
            displayMode: 'fixed',
            uids: 'uids'
        })
    );
});

test('dynamic block config aggregator retrieves data and display inline', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="dynamic_block" data-appearance="default" data-element="main"><div class="widget block block-banners-inline" data-banner-id="2" data-types="" data-display-mode="fixed" data-ids="2" data-rotate="" data-store-id="2" data-banner-name="Block 2" data-banner-status="Enabled" data-uids="uids"></div></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0]);

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            displayInline: true,
            displayMode: 'fixed',
            uids: 'uids'
        })
    );
});
