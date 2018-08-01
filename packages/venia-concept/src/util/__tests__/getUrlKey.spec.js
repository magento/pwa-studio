import getUrlKey from '../getUrlKey';

test('returns the no-extension basename from a set of URL properties', () => {
    const a = document.createElement('a');
    a.setAttribute('href', 'http://example.com/this-is-url-key.html');
    expect(getUrlKey(a)).toBe('this-is-url-key');
});

test('gets the last path segment', () => {
    const uri = new URL(
        'https://user:pass@example.com:8000/baseDir/path2/lastSegment.html?some=query'
    );
    expect(getUrlKey(uri)).toBe('lastSegment');
});

test('uses the window.location object if no argument', () => {
    // should match pathname except with no leading slash
    expect(getUrlKey()).toMatch(window.location.pathname.replace(/^\//, ''));
});
