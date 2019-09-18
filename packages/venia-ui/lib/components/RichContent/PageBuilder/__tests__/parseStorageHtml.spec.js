import parseStorageHtml from '../parseStorageHtml';

test('parse valid root element', () => {
    const testMasterFormat =
        '<div data-content-type="row" data-appearance="contained" data-element="main"><div class="test-class" data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: center; display: flex; flex-direction: column; background-color: rgb(17, 85, 0); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: center; border-style: solid; border-color: rgb(255, 0, 0); border-width: 10px; border-radius: 5px; min-height: 100px; margin: 5px; padding: 15px;"><h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">Test Heading</h2></div></div>';

    const data = parseStorageHtml(testMasterFormat);
    expect(data).toMatchSnapshot();
});

test('test invalid content type and expect warning', () => {
    const testInvalidMasterFormat =
        '<div data-content-type="garbage"/>';

    jest.spyOn(console, 'warn').mockImplementation(() => {});
    parseStorageHtml(testInvalidMasterFormat);

    expect(console.warn).toHaveBeenCalled();
});
