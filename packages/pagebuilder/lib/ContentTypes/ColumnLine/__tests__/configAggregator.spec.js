import configAggregator from '../configAggregator';

test('columnLine config is aggregated correctly retrieving display property', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div class="pagebuilder-column-line" style="display:flex;" data-content-type="column-line" 
        data-grid-size="12" data-element="main"></div>`;

    expect(configAggregator(node.childNodes[0])).toEqual(
        expect.objectContaining({
            display: 'flex'
        })
    );
});
