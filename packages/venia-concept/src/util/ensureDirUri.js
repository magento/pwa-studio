/**
 * Given a URI, will always return the same URI with a trailing slash
 * @param {string} uri
 */
export default function ensureDirUri(uri) {
    return uri.endsWith('/') ? uri : uri + '/';
}
