import configAggregator from '../configAggregator';

test('block config aggregator retrieves CMS block HTML', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="block" data-appearance="default" data-element="main"><div class="widget block block-static-block">RICH_DUMMY_CONTENT</div></div>`;
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        }).richContent
    ).toEqual('RICH_DUMMY_CONTENT');
});
