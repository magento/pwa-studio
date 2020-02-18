/**
 * Determine if the content is Page Builder or not
 *
 * @param content
 * @returns {boolean}
 */
export default function detectPageBuilder(content) {
    return /data-content-type=/.test(content);
}
