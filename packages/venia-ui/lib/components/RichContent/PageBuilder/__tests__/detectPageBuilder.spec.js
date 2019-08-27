import detectPageBuilder from '../detectPageBuilder';

test('detects valid Page Builder master format', () => {
    expect(detectPageBuilder('<div data-content-type="row"></div>')).toBe(true);
    expect(detectPageBuilder('<div></div>')).toBe(false);
});
