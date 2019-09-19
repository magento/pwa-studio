import configAggregator from '../configAggregator';

test('config is aggregated correctly for html content type', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="html" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">&lt;button href='{{config path="web/unsecure/base_url"}}'&gt;{{widget type="Magento\\Cms\\Block\\Widget\\Page\\Link" anchor_text="Anchor Custom Text" title="Anchor Custom Title" template="widget/link/link_inline.phtml" page_id="2"}}&lt;/button&gt;&lt;img src="{{media url=catalog/category/carefree.jpg}}" alt="" /&gt;</div>`;

    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            html:
                '<button href="{{config path=&quot;web/unsecure/base_url&quot;}}">{{widget type="Magento\\Cms\\Block\\Widget\\Page\\Link" anchor_text="Anchor Custom Text" title="Anchor Custom Title" template="widget/link/link_inline.phtml" page_id="2"}}</button><img src="{{media url=catalog/category/carefree.jpg}}" alt="">'
        })
    );
});
