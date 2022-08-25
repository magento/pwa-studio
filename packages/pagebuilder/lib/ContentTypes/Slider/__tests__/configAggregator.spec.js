import configAggregator from '../configAggregator';

test('config is aggregated correctly for slider', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div class="pagebuilder-slider" data-content-type="slider" data-appearance="default" data-autoplay="true" data-autoplay-speed="500" data-fade="true" data-infinite-loop="true" data-show-arrows="true" data-show-dots="true" data-element="main" style="min-height: 300px; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;"></div>`;
    const config = configAggregator(node.childNodes[0], {
        appearance: 'contained'
    });

    expect(config).toEqual(
        expect.objectContaining({
            minHeight: '300px',
            autoplay: true,
            autoplaySpeed: 500,
            fade: true,
            infinite: true,
            showArrows: true,
            showDots: true
        })
    );
});
