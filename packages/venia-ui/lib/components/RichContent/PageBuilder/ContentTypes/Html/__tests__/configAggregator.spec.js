import configAggregator from '../configAggregator';

test('config is aggregated correctly for html content type', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;"><div data-content-type="html" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">&lt;button href='{{config path="web/unsecure/base_url"}}'&gt;{{widget type="Magento\\Cms\\Block\\Widget\\Page\\Link" anchor_text="Anchor Custom Text" title="Anchor Custom Title" template="widget/link/link_inline.phtml" page_id="2"}}&lt;/button&gt;&lt;img src="{{media url=catalog/category/carefree.jpg}}" alt="" /&gt;</div></div></div>`;
    const config = configAggregator(node.childNodes[0]);

    expect(config).toMatchSnapshot();
});
