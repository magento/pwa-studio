import configAggregator from '../configAggregator';

test('column config is aggregated correctly without minHeight property', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div class="pagebuilder-column myCssColumnClass"
        data-content-type="column"
        data-appearance="default"
        data-background-images='{\\"desktop_image\\":\\"image-desktop.png\\",\\"mobile_image\\":\\"image-mobile.png\\"}'
        data-element="main"
        style="justify-content: flex-start;
            display: flex;
            flex-direction: column;
            background-color: rgb(193, 193, 193);
            background-position: left top;
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: scroll;
            text-align: center;
            border-style: solid;
            border-color: rgb(0, 0, 0);
            border-width: 1px;
            border-radius: 10px;
            width: calc((100% / 3) - 20px);
            margin: 10px;
            padding: 10px;
            align-self: stretch;">
    </div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'full-height'
    });

    expect(aggregatedConfig).toEqual(
        expect.not.objectContaining({
            minHeight: expect.any(String)
        })
    );
});

test('column config is aggregated correctly retrieving all properties', () => {
    const node = document.createElement('div');
    node.innerHTML = `<div class="pagebuilder-column myCssColumnClass"
        data-content-type="column"
        data-appearance="default"
        data-background-images='{\\"desktop_image\\":\\"image-desktop.png\\",\\"mobile_image\\":\\"image-mobile.png\\"}'
        data-element="main"
        style="justify-content: flex-start;
            display: flex;
            flex-direction: column;
            background-color: rgb(193, 193, 193);
            background-position: left top;
            background-size: cover;
            background-repeat: no-repeat;
            background-attachment: scroll;
            text-align: center;
            border-style: solid;
            border-color: rgb(0, 0, 0);
            border-width: 1px;
            border-radius: 10px;
            min-height: 300px;
            width: calc((100% / 3) - 20px);
            margin: 10px;
            padding: 10px;
            align-self: stretch;">
    </div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'full-height'
    });

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            backgroundColor: 'rgb(193, 193, 193)',
            display: 'flex',
            minHeight: '300px',
            width: expect.any(String)
        })
    );
});
