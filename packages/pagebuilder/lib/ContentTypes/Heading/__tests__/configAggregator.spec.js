import configAggregator from '../configAggregator';

test('heading config aggregator retrieves heading type and text', () => {
    const node = document.createElement('div');
    node.innerHTML = `<h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">Test Heading Text</h2>`;
    expect(
        configAggregator(node.childNodes[0], {
            appearance: 'default'
        })
    ).toEqual(
        expect.objectContaining({
            headingType: 'h2',
            text: 'Test Heading Text'
        })
    );
});

test('verify heading type is lowercase', () => {
    const node = document.createElement('div');
    node.innerHTML = `<h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">Test Heading Text</h2>`;
    const headingType = configAggregator(node.childNodes[0], {
        appearance: 'default'
    }).headingType;
    expect(headingType.toLowerCase()).toEqual(headingType);
});
