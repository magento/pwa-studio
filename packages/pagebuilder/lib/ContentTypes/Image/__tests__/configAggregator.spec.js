import configAggregator from '../configAggregator';

test('image config aggregator retrieves image data without anchor', () => {
    const node = document.createElement('div');
    node.innerHTML = `<figure data-content-type="image" data-appearance="full-width" data-element="main" style="margin: 0px; padding: 0px; border-style: none;"><img class="pagebuilder-mobile-hidden" src="desktop-image.png" alt="Test Alt Text" title="Test Title Text" data-element="desktop_image" style="border-style: none; border-width: 1px; border-radius: 0px; max-width: 100%; height: auto;" data-image-dimensions="{&quot;height&quot;:300,&quot;width&quot;:460,&quot;ratio&quot;:0.65}"><img class="pagebuilder-mobile-only" src="mobile-image.png" alt="Test Alt Text" title="Test Title Text" data-element="mobile_image" style="border-style: none; border-width: 1px; border-radius: 0px; max-width: 100%; height: auto;" data-image-dimensions="{&quot;height&quot;:200,&quot;width&quot;:100,&quot;ratio&quot;:0.5}"></figure>`;
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'full-width'
        })
    ).toEqual(
        expect.objectContaining({
            desktopImage: {
                dimensions: { height: 300, ratio: 0.65, width: 460 },
                src: 'desktop-image.png'
            },
            mobileImage: {
                dimensions: { height: 200, ratio: 0.5, width: 100 },
                src: 'mobile-image.png'
            },
            altText: 'Test Alt Text',
            title: 'Test Title Text'
        })
    );
});

test('image config aggregator retrieves image data with anchor', () => {
    const node = document.createElement('div');
    node.innerHTML = `<figure class="another-class-image" data-content-type="image" data-appearance="full-width" data-element="main" style="text-align: center; margin: 1px 2px 3px 4px; padding: 5px 6px 7px 8px; border-style: none;"><a href="/test-link" target="" data-link-type="page" title="Title Text" data-element="link"><img class="pagebuilder-mobile-hidden" src="desktop-image.png" alt="Alt Text" title="Title Text" data-element="desktop_image" style="border-style: solid; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 10px; max-width: 100%; height: auto;" data-image-dimensions="{&quot;height&quot;:300,&quot;width&quot;:460,&quot;ratio&quot;:0.65}"><img class="pagebuilder-mobile-only" src="mobile-image.png" alt="Alt Text" title="Title Text" data-element="mobile_image" style="border-style: solid; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 10px; max-width: 100%; height: auto;" data-image-dimensions="{&quot;height&quot;:200,&quot;width&quot;:100,&quot;ratio&quot;:0.5}"></a><figcaption data-element="caption">Test Caption</figcaption></figure>`;
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'full-width'
        })
    ).toEqual(
        expect.objectContaining({
            desktopImage: {
                dimensions: { height: 300, ratio: 0.65, width: 460 },
                src: 'desktop-image.png'
            },
            mobileImage: {
                dimensions: { height: 200, ratio: 0.5, width: 100 },
                src: 'mobile-image.png'
            },
            altText: 'Alt Text',
            title: 'Title Text',
            link: '/test-link',
            caption: 'Test Caption'
        })
    );
});

test('image config aggregator sets proper mobileImage when desktopImage equals mobilImage', () => {
    const node = document.createElement('div');
    node.innerHTML = `<figure class="another-class-image" data-content-type="image" data-appearance="full-width" data-element="main" style="text-align: center; margin: 1px 2px 3px 4px; padding: 5px 6px 7px 8px; border-style: none;"><a href="/test-link" target="" data-link-type="page" title="Title Text" data-element="link"><img class="pagebuilder-mobile-hidden" src="same-image.png" alt="Alt Text" title="Title Text" data-element="desktop_image" style="border-style: solid; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 10px; max-width: 100%; height: auto;" data-image-dimensions="{&quot;height&quot;:300,&quot;width&quot;:460,&quot;ratio&quot;:0.65}"><img class="pagebuilder-mobile-only" src="same-image.png" alt="Alt Text" title="Title Text" data-element="mobile_image" style="border-style: solid; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 10px; max-width: 100%; height: auto;" data-image-dimensions="{&quot;height&quot;:300,&quot;width&quot;:460,&quot;ratio&quot;:0.65}"></a><figcaption data-element="caption">Test Caption</figcaption></figure>`;

    const config = configAggregator(node.childNodes[0]);

    expect(config).toEqual(
        expect.objectContaining({
            desktopImage: {
                dimensions: { height: 300, ratio: 0.65, width: 460 },
                src: 'same-image.png'
            },
            mobileImage: null
        })
    );
});
test('image config aggregator sets proper mobileImage only', () => {
    const node = document.createElement('div');
    node.innerHTML = `<figure data-content-type="image" data-appearance="full-width" data-element="main" style="margin: 0px; padding: 0px; border-style: none;"><img class="pagebuilder-mobile-only" src="mobile-image.png" alt="Test Alt Text" title="Test Title Text" data-element="mobile_image" style="border-style: none; border-width: 1px; border-radius: 0px; max-width: 100%; height: auto;" data-image-dimensions="{&quot;height&quot;:200,&quot;width&quot;:100,&quot;ratio&quot;:0.5}"></figure>`;

    const config = configAggregator(node.childNodes[0]);

    expect(config).toEqual(
        expect.objectContaining({
            desktopImage: null,
            mobileImage: {
                dimensions: { height: 200, ratio: 0.5, width: 100 },
                src: 'mobile-image.png'
            }
        })
    );
});

test('image config aggregator doesnt fail on empty figure', () => {
    const node = document.createElement('div');
    node.innerHTML = `<figure data-content-type="image" data-appearance="full-width" data-element="main" style="margin: 0px; padding: 0px;"></figure>`;

    const config = configAggregator(node.childNodes[0]);
    expect(config).toEqual({});
});
