import configAggregator from '../configAggregator';

test('config is aggregated correctly for row appearance == contained', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="row" data-appearance="contained" data-element="main"><div class="class1 class2" data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: right; border-style: dashed; border-color: rgb(252, 0, 9); border-width: 20px; border-radius: 30px; margin: 5px; padding: 10px;"></div></div>`;
    const config = configAggregator(node.childNodes[0], {
        appearance: 'contained'
    });

    expect(config).toEqual(
        expect.objectContaining({
            minHeight: null,
            backgroundColor: null,
            enableParallax: false,
            parallaxSpeed: 0.5
        })
    );
});

test('config is aggregated correctly for row appearance != contained', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="row" data-appearance="full-bleed" data-enable-parallax="1" data-parallax-speed="2.0" data-background-images="{}" data-element="main" style="justify-content: flex-end; display: flex; flex-direction: column; background-color: rgb(33, 255, 255); background-position: left top; background-size: contain; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; min-height: 900px; margin: 0px 0px 10px; padding: 10px;"></div>`;
    const config = configAggregator(node.childNodes[0], {
        appearance: 'full-bleed'
    });

    expect(config).toEqual(
        expect.objectContaining({
            minHeight: '900px',
            backgroundColor: 'rgb(33, 255, 255)',
            enableParallax: true,
            parallaxSpeed: 2.0
        })
    );
});

test('config is aggregated correctly for row appearance == contained with video background', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-appearance="contained" data-content-type="row" data-element="main"><div data-background-images="{}" data-background-type="video" data-element="inner" data-enable-parallax="0" data-parallax-speed="0.5" data-video-fallback-src="" data-video-lazy-load="true" data-video-loop="true" data-video-play-only-visible="true" data-video-src="https://example.video" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; min-height: 75vh; margin: 0px 0px 10px; padding: 10px;"><div class="video-overlay" data-element="video_overlay" data-video-overlay-color="rgba(255, 0, 0, 0.45)" style="background-color: rgba(255, 0, 0, 0.45);"></div></div></div>`;
    const config = configAggregator(node.childNodes[0], {
        appearance: 'contained'
    });

    expect(config).toEqual(
        expect.objectContaining({
            backgroundType: 'video',
            videoFallbackSrc: '',
            videoLazyLoading: true,
            videoLoop: true,
            videoOverlayColor: 'rgba(255, 0, 0, 0.45)',
            videoPlayOnlyVisible: true,
            videoSrc: 'https://example.video'
        })
    );
});

test('config is aggregated correctly for row appearance == full-bleed with video background', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-appearance="full-bleed" data-background-images="{}" data-background-type="video" data-content-type="row" data-element="main" data-enable-parallax="0" data-parallax-speed="0.5" data-video-fallback-src="" data-video-lazy-load="true" data-video-loop="true" data-video-play-only-visible="true" data-video-src="https://example.video" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; min-height: 75vh; margin: 0px 0px 10px; padding: 10px;"><div class="video-overlay" data-element="video_overlay" data-video-overlay-color="rgba(255, 0, 0, 0.45)" style="background-color: rgba(255, 0, 0, 0.45);"></div></div>`;
    const config = configAggregator(node.childNodes[0], {
        appearance: 'full-bleed'
    });

    expect(config).toEqual(
        expect.objectContaining({
            backgroundType: 'video',
            videoFallbackSrc: '',
            videoLazyLoading: true,
            videoLoop: true,
            videoOverlayColor: 'rgba(255, 0, 0, 0.45)',
            videoPlayOnlyVisible: true,
            videoSrc: 'https://example.video'
        })
    );
});

test('config is aggregated correctly for row appearance == full-width with video background', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-appearance="full-width" data-background-images="{}" data-background-type="video" data-content-type="row" data-element="main" data-enable-parallax="1" data-parallax-speed="0.5" data-video-fallback-src="" data-video-lazy-load="true" data-video-loop="true" data-video-play-only-visible="true" data-video-src="https://example.video" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; min-height: 75vh; margin: 0px 0px 10px;"><div class="video-overlay" data-element="video_overlay" data-video-overlay-color="rgba(255, 0, 0, 0.45)" style="background-color: rgba(255, 0, 0, 0.45);"></div><div class="row-full-width-inner" data-element="inner" style="padding: 10px;"></div>`;
    const config = configAggregator(node.childNodes[0], {
        appearance: 'full-width'
    });

    expect(config).toEqual(
        expect.objectContaining({
            backgroundType: 'video',
            videoFallbackSrc: '',
            videoLazyLoading: true,
            videoLoop: true,
            videoOverlayColor: 'rgba(255, 0, 0, 0.45)',
            videoPlayOnlyVisible: true,
            videoSrc: 'https://example.video'
        })
    );
});

test('config is aggregated correctly for row containing dynamic block', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="row" data-appearance="contained" data-element="main"><div class="class1 class2" data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: right; border-style: dashed; border-color: rgb(252, 0, 9); border-width: 20px; border-radius: 30px; margin: 5px; padding: 10px; min-height: 40px;"><div data-content-type="dynamic_block" data-appearance="default" data-element="main">{{widget type="Magento\\Banner\\Block\\Widget\\Banner" display_mode="fixed" rotate="" template="widget/block.phtml" banner_ids="2" unique_id="2" type_name="Dynamic Blocks Rotator"}}</div></div></div>`;
    const config = configAggregator(node.childNodes[0], {
        appearance: 'contained'
    });

    // minHeight should be null, minHeight is managed by dynamicBlock
    expect(config).toEqual(
        expect.objectContaining({
            minHeight: null,
            backgroundColor: null,
            enableParallax: false,
            parallaxSpeed: 0.5
        })
    );
});
