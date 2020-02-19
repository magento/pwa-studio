import configAggregator from '../configAggregator';

test('divider config aggregator retrieves divider width, color, and thickness', () => {
    const node = document.createElement('div');
    node.innerHTML = `<hr data-element="line" style="width: 100%; border-width: 1px; border-color: rgb(206, 206, 206); display: inline-block;">`;
    expect(
        configAggregator(node, {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            width: '100%',
            color: 'rgb(206, 206, 206)',
            thickness: '1px'
        })
    );
});
