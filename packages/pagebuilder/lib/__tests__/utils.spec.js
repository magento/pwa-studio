import {
    getBackgroundImages,
    getBorder,
    getCssClasses,
    getMargin,
    getPadding,
    getTextAlign,
    getVerticalAlignment,
    verticalAlignmentToFlex,
    getMediaQueries
} from '../utils';

test('can retrieve background image from node', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div data-background-images="{\\&quot;desktop_image\\&quot;:\\&quot;{{media url=wysiwyg/gear/gear-main.jpg}}\\&quot;,\\&quot;mobile_image\\&quot;:\\&quot;{{media url=wysiwyg/magento-logo.png}}\\&quot;}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: center center; background-size: contain; background-repeat: repeat; background-attachment: fixed;"></div>';
    expect(getBackgroundImages(node.childNodes[0])).toMatchSnapshot();
});

test('can set image properties with no image properties in node', () => {
    const node = document.createElement('div');
    node.innerHTML = '<div/>';
    expect(getBackgroundImages(node.childNodes[0])).toMatchSnapshot();
});

test('can retrieve vertical alignment', () => {
    const node = document.createElement('div');
    node.innerHTML = '<div style="justify-content: flex-start;"></div>';
    expect(getVerticalAlignment(node.childNodes[0]).verticalAlignment).toEqual(
        'top'
    );
    node.innerHTML = '<div style="justify-content: center;"></div>';
    expect(getVerticalAlignment(node.childNodes[0]).verticalAlignment).toEqual(
        'middle'
    );
    node.innerHTML = '<div style="justify-content: flex-end;"></div>';
    expect(getVerticalAlignment(node.childNodes[0]).verticalAlignment).toEqual(
        'bottom'
    );
});

test('can convert vertical alignment to flex property', () => {
    expect(verticalAlignmentToFlex('top')).toEqual('flex-start');
    expect(verticalAlignmentToFlex('middle')).toEqual('center');
    expect(verticalAlignmentToFlex('bottom')).toEqual('flex-end');
});

test('can set vertical alignment with no vertical alignment properties in node', () => {
    const node = document.createElement('div');
    node.innerHTML = '<div/>';
    expect(
        getVerticalAlignment(node.childNodes[0]).verticalAlignment
    ).toBeNull();
});

test('can retrieve padding', () => {
    const node = document.createElement('div');
    node.innerHTML = '<div style="padding: 10px;"></div>';
    expect(getPadding(node.childNodes[0])).toEqual({
        paddingBottom: '10px',
        paddingRight: '10px',
        paddingTop: '10px',
        paddingLeft: '10px'
    });
    node.innerHTML = '<div style="padding: 1px 2px 3px 4px;"></div>';
    expect(getPadding(node.childNodes[0])).toEqual({
        paddingBottom: '3px',
        paddingRight: '2px',
        paddingTop: '1px',
        paddingLeft: '4px'
    });
});

test('can retrieve margin', () => {
    const node = document.createElement('div');
    node.innerHTML = '<div style="margin: 10px;"></div>';
    expect(getMargin(node.childNodes[0])).toEqual({
        marginBottom: '10px',
        marginRight: '10px',
        marginTop: '10px',
        marginLeft: '10px'
    });
    node.innerHTML = '<div style="margin: 1px 2px 3px 4px;"></div>';
    expect(getMargin(node.childNodes[0])).toEqual({
        marginBottom: '3px',
        marginRight: '2px',
        marginTop: '1px',
        marginLeft: '4px'
    });
});

test('can retrieve border', () => {
    const node = document.createElement('div');
    node.innerHTML =
        '<div style="border-style: solid; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 2px;"></div></div>';
    expect(getBorder(node.childNodes[0])).toEqual({
        border: 'solid',
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: '5px',
        borderRadius: '2px'
    });
    node.innerHTML = '<div style="border: 10px double red;"></div></div>';
    expect(getBorder(node.childNodes[0])).toEqual({
        border: 'double',
        borderColor: 'red',
        borderWidth: '10px',
        borderRadius: ''
    });
});

test('can retrieve text align', () => {
    const node = document.createElement('div');
    node.innerHTML = '<div style="text-align: center;"></div>';
    expect(getTextAlign(node.childNodes[0]).textAlign).toEqual('center');
});

test('can retrieve CSS classes', () => {
    const node = document.createElement('div');
    node.innerHTML = '<div class="one two three"></div>';
    expect(getCssClasses(node.childNodes[0]).cssClasses).toEqual([
        'one',
        'two',
        'three'
    ]);
    node.innerHTML = '<div></div>';
    expect(getCssClasses(node.childNodes[0]).cssClasses).toEqual([]);
});

test('can retrieve mediaQueries', () => {
    const node = document.createElement('div');
    node.setAttribute('data-media-0', 'only screen and (min-width: 768px)');
    node.setAttribute(
        'data-media-style-0',
        'display: flex; min-height: 300px;'
    );
    const { mediaQueries } = getMediaQueries(node);
    expect(mediaQueries).toEqual([
        {
            media: 'only screen and (min-width: 768px)',
            style: {
                display: 'flex',
                minHeight: '300px'
            }
        }
    ]);
});
