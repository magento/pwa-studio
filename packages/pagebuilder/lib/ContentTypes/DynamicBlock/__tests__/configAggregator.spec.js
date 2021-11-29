import configAggregator from '../configAggregator';

test('dynamic block config aggregator retrieves data', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="dynamic_block" data-appearance="default" data-element="main"><div class="widget block block-banners" data-banner-id="1" data-types="" data-display-mode="fixed" data-ids="1" data-rotate="" data-store-id="1" data-banner-name="Block 1"data-banner-status="Enabled" data-uids="uids"></div></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'default'
    });

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            displayMode: 'fixed',
            uids: 'uids'
        })
    );
});
