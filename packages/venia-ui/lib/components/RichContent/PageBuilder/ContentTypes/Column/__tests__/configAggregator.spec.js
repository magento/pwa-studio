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
            width: calc(33.3333% - 20px);
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
            width: calc(33.3333% - 20px);
            margin: 10px;
            padding: 10px;
            align-self: stretch;">
    </div>`;

    const aggregatedConfig = configAggregator(node.childNodes[0], {
        appearance: 'full-height'
    });

    expect(aggregatedConfig).toEqual(
        expect.objectContaining({
            backgroundAttachment: 'scroll',
            backgroundColor: 'rgb(193, 193, 193)',
            backgroundPosition: 'left top',
            backgroundRepeat: false,
            backgroundSize: 'cover',
            border: 'solid',
            borderColor: 'rgb(0, 0, 0)',
            borderRadius: '10px',
            borderWidth: '1px',
            cssClasses: ['pagebuilder-column', 'myCssColumnClass'],
            desktopImage: 'image-desktop.png',
            display: 'flex',
            marginBottom: '10px',
            marginLeft: '10px',
            marginRight: '10px',
            marginTop: '10px',
            minHeight: '300px',
            mobileImage: 'image-mobile.png',
            paddingBottom: '10px',
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '10px',
            textAlign: 'center',
            verticalAlignment: 'top',
            width: expect.any(String)
        })
    );
});
