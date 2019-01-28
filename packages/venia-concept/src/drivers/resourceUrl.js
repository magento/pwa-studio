export default class ResourceUrl {
    constructor(url) {
        this.url = url;
    }
    toString() {
        return this.url.toString();
    }
}

/**
 * Venia components build URLs based on assumptions about the local origin,
 * which are declared in venia-upward.yml. Nevertheless, third parties will use
 * Venia components outside of the app which defines those UPWARD requirements.
 *
 * Therefore, Venia uses this one class to generate all URLs, and components
 * consume it as an export of the drivers module.
 *
 * Its default implementation is a simple pass-through class for strings.
 */
