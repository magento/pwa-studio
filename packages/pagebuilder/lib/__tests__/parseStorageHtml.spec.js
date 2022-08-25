import parseStorageHtml from '../parseStorageHtml';

jest.mock('../config', () => {
    return {
        getContentTypeConfig: contentType => {
            if (contentType === 'none') {
                return null;
            }
            if (contentType === 'error') {
                return {
                    configAggregator: () => {
                        throw 'Error';
                    }
                };
            }
            return {
                configAggregator: () => {}
            };
        }
    };
});

const testMasterFormat =
    '<div data-pb-style="D119W07" data-content-type="row" data-appearance="contained" data-element="main"><div class="test-class" data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: center; display: flex; flex-direction: column; background-color: rgb(17, 85, 0); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: center; border-style: solid; border-color: rgb(255, 0, 0); border-width: 10px; border-radius: 5px; min-height: 100px; margin: 5px; padding: 15px;"><h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">Test Heading</h2></div></div>';

test('has root-container as root element', () => {
    const data = parseStorageHtml(testMasterFormat);
    expect(data.contentType).toEqual('root-container');
});

test('parse valid root element', () => {
    const data = parseStorageHtml(testMasterFormat);
    expect(data).toMatchSnapshot();
});

test('alerts user through console when content type is not supported', () => {
    const masterFormatHtml = '<div data-content-type="none"></div>';
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    parseStorageHtml(masterFormatHtml);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
});

test('alerts user through console when configAggregator throws error', () => {
    const masterFormatHtml = '<div data-content-type="error"></div>';
    const spy = jest.spyOn(console, 'error').mockImplementation();
    parseStorageHtml(masterFormatHtml);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
});

test('convert to inline styles', () => {
    const styleSheet = new CSSStyleSheet();
    styleSheet.insertRule('.no-element { color: none }', 0);
    styleSheet.insertRule(
        '#html-body [data-pb-style=D119W07] { color: transparent }',
        1
    );
    const getElementsByTagNameSpy = jest
        .spyOn(Document.prototype, 'getElementsByTagName')
        .mockReturnValueOnce([
            {
                sheet: styleSheet
            }
        ]);
    const setAttributeSpy = jest
        .spyOn(Element.prototype, 'setAttribute')
        .mockImplementation();
    parseStorageHtml(testMasterFormat);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(
        1,
        'style',
        'color: transparent;'
    );
    getElementsByTagNameSpy.mockRestore();
    setAttributeSpy.mockRestore();
});

test('saves media query styles into data attributes', () => {
    const styleSheet = new CSSStyleSheet();
    styleSheet.insertRule(
        '#html-body [data-pb-style=D119W07] { color: transparent }',
        0
    );
    styleSheet.insertRule(
        '@media only screen and (max-width: 768px) { #html-body [data-pb-style=D119W07] { min-height: 100px }}',
        1
    );
    const getElementsByTagNameSpy = jest
        .spyOn(Document.prototype, 'getElementsByTagName')
        .mockReturnValueOnce([
            {
                sheet: styleSheet
            }
        ]);
    const setAttributeSpy = jest
        .spyOn(Element.prototype, 'setAttribute')
        .mockImplementation();
    parseStorageHtml(testMasterFormat);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(
        1,
        'data-media-0',
        'only screen and (max-width: 768px)'
    );
    expect(setAttributeSpy).toHaveBeenNthCalledWith(
        2,
        'data-media-style-0',
        'min-height: 100px;'
    );
    getElementsByTagNameSpy.mockRestore();
    setAttributeSpy.mockRestore();
});
