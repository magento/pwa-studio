import configAggregator from '../configAggregator';

test('text config aggregator retrieves content', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="text" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;"><p><strong>Here's some glorious text!</strong></p></div>`;
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        }).content
    ).toEqual("<p><strong>Here's some glorious text!</strong></p>");
});
