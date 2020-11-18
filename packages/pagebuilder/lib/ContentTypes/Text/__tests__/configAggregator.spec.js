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

test('text config aggregator updates links with active store code', () => {
    const old = process.env.USE_STORE_CODE_IN_URL;
    const oldCode = window.STORE_VIEW_CODE;

    process.env.USE_STORE_CODE_IN_URL = true;
    window.STORE_VIEW_CODE = 'fr';

    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="text" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;"><a href="/shop-the-look.html"></a></div>`;

    expect(configAggregator(node.childNodes[0]).content).toEqual(
        '<a href="/fr/shop-the-look.html"></a>'
    );

    process.env.USE_STORE_CODE_IN_URL = old;
    window.STORE_VIEW_CODE = oldCode;
});
