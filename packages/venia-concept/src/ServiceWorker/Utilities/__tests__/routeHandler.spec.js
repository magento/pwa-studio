import { isHTMLRoute, isHomeRoute } from '../routeHandler';

const homePageUrl = 'https://develop.pwa-venia.com/';
const urlWithHTML = 'https://develop.pwa-venia.com/isodora-skirt.html';
const nonHTMLRoute =
    'https://magento-venia-concept-7bnnn.local.pwadev:9914/media/';

describe('isHomeRoute', () => {
    test('returns a boolean', () => {
        expect(typeof isHomeRoute(new URL(homePageUrl))).toBe('boolean');
    });

    test("returns true if route's pathname is /", () => {
        expect(isHomeRoute(new URL(homePageUrl))).toBeTruthy();
    });

    test("returns false if route's pathname is not /", () => {
        expect(isHomeRoute(new URL(urlWithHTML))).toBeFalsy();
    });

    test('returns true if pathname matches an available store view code', () => {
        const previousEnv = process.env.USE_STORE_CODE_IN_URL;
        process.env.USE_STORE_CODE_IN_URL = true;

        expect(isHomeRoute(new URL(`${homePageUrl}default`))).toBeTruthy();
        expect(isHomeRoute(new URL(`${homePageUrl}fr`))).toBeTruthy();
        expect(isHomeRoute(new URL(`${homePageUrl}default/`))).toBeTruthy();
        expect(isHomeRoute(new URL(`${homePageUrl}fr/`))).toBeTruthy();

        // Reset.
        process.env.USE_STORE_CODE_IN_URL = previousEnv;
    });

    test('returns false if pathname has does not end in store code', () => {
        const previousEnv = process.env.USE_STORE_CODE_IN_URL;
        process.env.USE_STORE_CODE_IN_URL = true;

        expect(isHomeRoute(new URL(`${homePageUrl}default/foo`))).toBeFalsy();
        expect(isHomeRoute(new URL(`${homePageUrl}fr/foo`))).toBeFalsy();

        // Reset.
        process.env.USE_STORE_CODE_IN_URL = previousEnv;
    });
});

describe('isHTMLRoute', () => {
    test('returns a boolean', () => {
        expect(typeof isHTMLRoute(new URL(urlWithHTML))).toBe('boolean');
    });

    test("returns true if route's pathname has .html", () => {
        expect(isHTMLRoute(new URL(urlWithHTML))).toBeTruthy();
    });

    test("returns false if route's pathname does not have .html", () => {
        expect(isHTMLRoute(new URL(nonHTMLRoute))).toBeFalsy();
    });

    test('returns true for home route', () => {
        expect(isHTMLRoute(new URL(homePageUrl))).toBeTruthy();
    });
});
