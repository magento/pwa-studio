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
