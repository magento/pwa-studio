import configAggregator from '../configAggregator';

test('buttons config is aggregated correctly without set same width property', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div 
        data-content-type="buttons" 
        data-appearance="inline" 
        data-same-width="false" 
        data-element="main" 
        style="border-style: none; 
            border-width: 1px
            border-radius: 0px
            margin: 0px
            padding: 10px 10px 0px;">
            <div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;">
                <div className="pagebuilder-button-primary" data-element="empty_link" style="text-align: center;">
                <span data-element="link_text">Button 1</span>
            </div>
        </div>
    </div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'inline'
    });

    expect(aggregatedConfig).toEqual(
        expect.not.objectContaining({
            sameWidth: expect.any(Boolean)
        })
    );
});

test('buttons config is aggregated correctly retrieving all properties', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div 
        data-content-type="buttons" 
        data-appearance="inline" 
        data-same-width="true" 
        data-element="main" 
        style="border-style: none; 
            border-width: 1px
            border-radius: 0px
            margin: 0px
            padding: 10px 10px 0px;">
            <div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;">
                <div className="pagebuilder-button-primary" data-element="empty_link" style="text-align: center;">
                <span data-element="link_text">Button 1</span>
            </div>
        </div>
    </div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'stacked'
    });

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            isSameWidth: true
        })
    );
});
