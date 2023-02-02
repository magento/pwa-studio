import { stripIgnoredCharacters } from 'graphql/utilities/stripIgnoredCharacters';

/**
 * Shrink a GraphQL query inside of a URL used in a GET request.
 * There are 2 problems with Apollo-client's encoding of URLs:
 *  1. Unnecessary spaces/line-breaks/punctuators are not removed,
 *     which leads to them being encode as hex, increasing the
 *     URL length dramatically
 *  2. `encodeURI` is used, which encodes spaces with 3 characters (%20).
 *     Because the GraphQL query is inside of a querystring, we can use
 *     application/x-www-form-urlencoded, which encodes spaces with a single
 *     character
 *
 * @param {string | URL} Absolute URL for GraphQL GET query
 * @returns {string} Absolute URL, with shrunken query
 */
export default function shrinkQuery(fullURL) {
    const url = new URL(fullURL);

    // Read from URL implicitly decodes the querystring
    const query = url.searchParams.get('query');
    if (!query) {
        return fullURL;
    }

    const strippedQuery = stripIgnoredCharacters(query);

    // URLSearchParams.set will use application/x-www-form-urlencoded encoding
    url.searchParams.set('query', strippedQuery);

    return url.toString();
}
