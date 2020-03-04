import configAggregator from '../configAggregator';

test('video config aggregator retrieves content with youtube', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="video" data-appearance="default" data-element="main" style="margin: 0px;"><div class="pagebuilder-video-inner" data-element="inner" style="max-width: 1000px;"><div class="pagebuilder-video-wrapper" data-element="wrapper" style="border-style: none; border-width: 1px; border-radius: 0px; padding: 0px;"><div class="pagebuilder-video-container"><iframe frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/N0bYol6ax8Y" data-element="video"></iframe></div></div></div></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'default'
    });

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            maxWidth: '1000px',
            url: 'https://www.youtube.com/embed/N0bYol6ax8Y'
        })
    );
});

test('video config aggregator retrieves content with local video', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="video" data-appearance="default" data-element="main" style="margin: 0px;"><div class="pagebuilder-video-inner" data-element="inner" style="max-width: 1000px;"><div class="pagebuilder-video-wrapper" data-element="wrapper" style="border-style: none; border-width: 1px; border-radius: 0px; padding: 0px;"><div class="pagebuilder-video-container"><video frameborder="0" controls="" src="https://example.com//video.mp4" autoplay="true" muted="true" data-element="video"></video></div></div></div></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'default'
    });

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            maxWidth: '1000px',
            url: 'https://example.com//video.mp4',
            autoplay: true,
            muted: true
        })
    );
});

test('video config aggregator retrieves content with empty url and maxWidth', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="video" data-appearance="default" data-element="main" style="text-align: right; margin: 0px;"><div className="pagebuilder-video-inner" data-element="inner"><div className="pagebuilder-video-wrapper" data-element="wrapper" style="border-style: none; border-width: 1px; border-radius: 0px; padding: 0px;"></div></div></div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'default'
    });

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            maxWidth: null,
            url: null
        })
    );
});
