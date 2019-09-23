import configAggregator from '../configAggregator';

test('columnGroup config is aggregated correctly retrieving display property', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div class="pagebuilder-column-group" style="display:flex;" data-content-type="column-group" 
        data-grid-size="12" data-element="main"></div>`;

    expect(configAggregator(node.childNodes[0])).toEqual(
        expect.objectContaining({
            display: 'flex'
        })
    );
});
