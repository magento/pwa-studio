export default function resourceUrl(url) {
    return url;
}

/**
 * Venia components build URLs based on assumptions about the local origin,
 * which are declared in venia-upward.yml. Nevertheless, third parties will use
 * Venia components outside of the app which defines those UPWARD requirements.
 *
 * Therefore, Venia uses this one function to generate all URLs, and components
 * consume it as an export of the drivers module.
 *
 * Its default implementation is a simple pass-through for strings, since Venia
 * controls its own URL schemes with venia-upward-yml. Apps consuming Venia
 * components may have a different UPWARD configuration, so they may need to
 * override this with custom logic.
 */
