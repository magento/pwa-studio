/**
 * isFastNetwork uses the navigator API to tell if a connection
 * is fast or not. It returns true if the connection is 4g which
 * is same for 4g, LTE and WiFi.
 *
 * The new navigator API will have a more granular distribution
 * for different types of connections once it is published.
 *
 * @returns {boolean}
 */
export const isFastNetwork = () => {
    if (navigator.connection && 'effectiveType' in navigator.connection) {
        return navigator.connection.effectiveType === '4g';
    } else {
        /**
         * No way to tell if network is fast or slow.
         * Default to fast to allow caching.
         *
         * Firefox does not support effectiveType API.
         */
        return true;
    }
};
