import configAggregator from '../configAggregator';

test('tab item retrieves items from tab', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="tab-item" data-appearance="default" data-tab-name="Our first tab" data-background-images="{\\&quot;desktop_image\\&quot;:\\&quot;media/wysiwyg/enhanced-storefront.jpg\\&quot;}" data-element="main" id="H9XAQET" style="justify-content: center; display: flex; flex-direction: column; background-position: center center; background-size: cover; background-repeat: repeat; background-attachment: scroll; border-width: 1px; border-radius: 0px; min-height: 350px; margin: 0px; padding: 40px;"><div class="pagebuilder-column-group" style="display: flex;" data-content-type="column-group" data-grid-size="12" data-element="main"><div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 50%; margin: 0px; padding: 10px; align-self: stretch;"><h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">Our left content</h2><div data-content-type="text" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;"><p>Some other great content right here! :)&nbsp;</p></div></div><div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 50%; margin: 0px; padding: 10px; align-self: stretch;"><figure data-content-type="image" data-appearance="full-width" data-element="main" style="margin: 0px; padding: 0px; border-style: none;"><img class="pagebuilder-mobile-hidden" src="media/wysiwyg/enhanced-storefront.jpg" alt="" title="" data-element="desktop_image" style="border-style: none; border-width: 1px; border-radius: 0px; max-width: 100%; height: auto;"><img class="pagebuilder-mobile-only" src="media/wysiwyg/enhanced-storefront.jpg" alt="" title="" data-element="mobile_image" style="border-style: none; border-width: 1px; border-radius: 0px; max-width: 100%; height: auto;"></figure></div></div></div>`;
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            tabName: 'Our first tab',
            minHeight: '350px'
        })
    );
});
