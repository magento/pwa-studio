import configAggregator from '../configAggregator';

test('button config is aggregated correctly with link opening in the same tab', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-primary" href="//product-link.html" target="" data-link-type="product" data-element="link" style="text-align: center;"><span data-element="link_text">Button text</span></a></div>`;

    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            openInNewTab: false,
            buttonType: 'primary'
        })
    );
});

test('button config is aggregated correctly with all properties', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-secondary" href="//product-link.html" target="_blank" data-link-type="product" data-element="link" style="text-align: center;"><span data-element="link_text">Button text</span></a></div>`;

    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            openInNewTab: true,
            display: 'inline-block',
            text: 'Button text',
            textAlign: 'center',
            buttonType: 'secondary',
            link: '//product-link.html',
            linkType: 'product'
        })
    );
});

test('button config is aggregated correctly', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;"><a class="pagebuilder-button-link" href="//product-link.html" target="_blank" data-link-type="product" data-element="link" style="text-align: center;"><span data-element="link_text">Button text</span></a></div>`;

    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            openInNewTab: true,
            display: 'inline-block',
            text: 'Button text',
            textAlign: 'center',
            buttonType: 'link',
            link: '//product-link.html',
            linkType: 'product'
        })
    );
});
