/**
 * Cookie utility helper for session sharing between browser and PWA standalone mode.
 * This enables iOS PWA to maintain authentication state when added to home screen.
 */

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = name => {
    if (typeof document === 'undefined') {
        return null;
    }

    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
};

/**
 * Check if cookies are available and working
 * @returns {boolean} True if cookies are supported
 */
export const areCookiesAvailable = () => {
    if (typeof document === 'undefined') {
        return false;
    }

    try {
        // Try to set a test cookie
        document.cookie = 'cookietest=1; path=/';
        const cookiesEnabled = document.cookie.indexOf('cookietest=') !== -1;
        // Delete test cookie
        document.cookie =
            'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
        return cookiesEnabled;
    } catch (e) {
        return false;
    }
};

/**
 * Detect if app is running in standalone mode (installed PWA)
 * @returns {boolean} True if running as standalone PWA
 */
export const isStandalonePWA = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }

    // Check for iOS standalone mode
    const isIOSStandalone =
        'standalone' in window.navigator && window.navigator.standalone;

    // Check for Android/Desktop PWA
    const isDisplayStandalone = window.matchMedia('(display-mode: standalone)')
        .matches;

    return isIOSStandalone || isDisplayStandalone;
};

/**
 * Get authentication token from cookie (for backend cookie-based auth)
 * @returns {string|null} Token from cookie or null
 */
export const getTokenFromCookie = () => {
    // Check for common Magento/PHP session cookie names
    // You may need to adjust these based on your backend configuration
    const possibleCookieNames = [
        'auth_token',
        'customer_token',
        'PHPSESSID',
        'magento_customer_token'
    ];

    for (const cookieName of possibleCookieNames) {
        const value = getCookie(cookieName);
        if (value) {
            return value;
        }
    }

    return null;
};

/**
 * Check if we should prefer cookies over localStorage
 * This is true in standalone PWA mode where localStorage might not be shared
 * @returns {boolean}
 */
export const shouldPreferCookies = () => {
    return isStandalonePWA() && areCookiesAvailable();
};
