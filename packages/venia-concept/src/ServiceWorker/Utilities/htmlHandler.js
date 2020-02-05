import { HTML_UPDATE_AVAILABLE } from '@magento/venia-ui/lib/constants/swMessageTypes';
import { parse } from 'node-html-parser';

import { sendMessageToWindow } from './messageHandler';

const generateScriptResource = htmlElement => htmlElement.attributes.src;

const generateLinkResource = htmlElement => htmlElement.attributes.href;

const generateStyleResource = htmlElement => htmlElement.text;

const identity = x => x;

/**
 * Generates list of resources from the parsed HTML object.
 *
 * @param {HTMLElement} parsedHTML
 *
 * @returns { scripts: [string], links: [string], styles: [string] }
 */
const generateResources = parsedHTML => {
    const resources = {};

    resources.scripts = parsedHTML
        .querySelectorAll('script')
        .map(generateScriptResource)
        .filter(identity)
        .sort();

    resources.links = parsedHTML
        .querySelectorAll('link')
        .map(generateLinkResource)
        .filter(identity)
        .sort();

    resources.styles = parsedHTML
        .querySelectorAll('style')
        .map(generateStyleResource)
        .filter(identity)
        .sort();

    return resources;
};

/**
 * Returns true if resouce url/urls have changed.
 *
 * @param {HTMLElement} newDOM
 * @param {HTMLElement} oldDOM
 *
 * @returns Boolean
 */
const haveResourcesChanged = (newDOM, oldDOM) => {
    const newResources = generateResources(newDOM);
    const oldResources = generateResources(oldDOM);
    const keysToCompare = Object.keys(newResources);

    return !keysToCompare.every(
        key => newResources[key].toString() === oldResources[key].toString()
    );
};

/**
 * Returns true if title has changed.
 *
 * @param {HTMLElement} newDOM
 * @param {HTMLElement} oldDOM
 *
 * @returns Boolean
 */
const hasTitleChanged = (newDOM, oldDOM) => {
    const oldTitle = (oldDOM.querySelector('title') || {}).text;
    const newTitle = (newDOM.querySelector('title') || {}).text;

    return newTitle !== oldTitle;
};

/**
 * Returns true if media backend url has changed.
 *
 * @param {HTMLElement} newDOM
 * @param {HTMLElement} oldDOM
 *
 * @returns Boolean
 */
const hasBackendUrlChanged = (newDOM, oldDOM) => {
    const oldUrl = oldDOM.querySelector('html').attributes[
        'data-media-backend'
    ];
    const newUrl = newDOM.querySelector('html').attributes[
        'data-media-backend'
    ];

    return newUrl !== oldUrl;
};

/**
 * Returns true if image optimizing origin has changed.
 *
 * @param {HTMLElement} newDOM
 * @param {HTMLElement} oldDOM
 *
 * @returns Boolean
 */
const hasImageOptimizingOriginChanged = (newDOM, oldDOM) => {
    const oldOrigin = oldDOM.querySelector('html').attributes[
        'data-image-optimizing-origin'
    ];
    const newOrigin = newDOM.querySelector('html').attributes[
        'data-image-optimizing-origin'
    ];

    return newOrigin !== oldOrigin;
};

/**
 * Array of verfication functions to run to determine
 * if HTML has changed and needs updation on the UI.
 */
const verificationFunctions = [
    haveResourcesChanged,
    hasTitleChanged,
    hasBackendUrlChanged,
    hasImageOptimizingOriginChanged
];

/**
 * Runs all verification functions with new and old
 * HTML to determine if HTML has changed.
 *
 * @param {HTMLElement} newDOM
 * @param {HTMLElement} oldDOM
 */
const hasHTMLChanged = (newDOM, oldDOM) =>
    verificationFunctions.some(fn => fn(newDOM, oldDOM));

const cloneRequestWithDiffURL = (request, url) =>
    url
        ? new Request(url, {
              method: request.method,
              headers: request.headers
          })
        : request;

/**
 * cacheHTMLPlugin is a workbox plugin that will apply request
 * and reponse manipulations on HTML routes.
 */
export const cacheHTMLPlugin = {
    cacheKeyWillBeUsed: async () => {
        /**
         * For all read and writes that arrive on any HTML route
         * return `/`.
         */
        return '/';
    },
    requestWillFetch: async ({ request }) => {
        /**
         * Clone the request with url as `/`.
         */
        const newRequest = cloneRequestWithDiffURL(request, '/');

        return newRequest;
    },
    fetchDidSucceed: async ({ request, response }) => {
        /**
         * Check if there is a response cached for the request
         * URL. If yes, compare the content of both the cached
         * response and the new response. If they are different
         * send the `HTML_UPDATE_AVAILABLE` message to window.
         */
        const cachedResponseObj = await caches.match(
            new URL(request.url).pathname
        );
        if (cachedResponseObj) {
            const cachedResponse = await cachedResponseObj.text();
            const clonedResponse = await response.clone().text();

            /**
             * Dont bother caculating changes if the response string
             * has not changed. Saves CPU cycles most of the time.
             */
            if (
                clonedResponse !== cachedResponse &&
                hasHTMLChanged(
                    parse(clonedResponse, { style: true }),
                    parse(cachedResponse, { style: true })
                )
            ) {
                sendMessageToWindow(HTML_UPDATE_AVAILABLE);
            }
        }
        return response;
    }
};
