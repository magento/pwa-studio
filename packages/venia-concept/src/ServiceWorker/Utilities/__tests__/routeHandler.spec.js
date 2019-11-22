import { isHTMLRoute, isHomeRoute } from '../routeHandler';

const homePageUrl = 'https://develop.pwa-venia.com/';
const urlWithHTML = 'https://develop.pwa-venia.com/isodora-skirt.html';
const nonHTMLRoute =
    'https://magento-venia-concept-7bnnn.local.pwadev:9914/media/';

test('isHomeRoute should return boolean', () => {
    expect(typeof isHomeRoute(new URL(homePageUrl))).toBe('boolean');
});

test("isHomeRoute should return true if route's pathname is /", () => {
    expect(isHomeRoute(new URL(homePageUrl))).toBeTruthy();
});

test("isHomeRoute should return false if route's pathname is not /", () => {
    expect(isHomeRoute(new URL(urlWithHTML))).toBeFalsy();
});

test('isHTMLRoute should return boolean', () => {
    expect(typeof isHTMLRoute(new URL(urlWithHTML))).toBe('boolean');
});

test("isHTMLRoute should return true if route's pathname has .html", () => {
    expect(isHTMLRoute(new URL(urlWithHTML))).toBeTruthy();
});

test("isHTMLRoute should return false if route's pathname does not have .html", () => {
    expect(isHTMLRoute(new URL(nonHTMLRoute))).toBeFalsy();
});

test('isHTMLRoute should return true for home route', () => {
    expect(isHTMLRoute(new URL(homePageUrl))).toBeTruthy();
});
