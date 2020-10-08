const { Targetables } = require('@magento/pwa-buildpack');

/**
 * Interface for the individual hooks.
 * It is a wrapper class for `TargetableESModule`, preserving the API of the
 * previous target implementation.
 */
class TargetableHook {
    /**
     * Creates a TargetableHook for one hook or talon module.
     * @param {string} talonPath - Resolvable path to the hook file, e.g. `@magento/peregrine/lib/hooks/useCarousel'.
     * @param {Object} talonConfig - Configuration for the wrap operation.
     * @param {string} talonConfig.exportName - Name of the export to wrap, e.g. `useCarousel`. Hooks and Talons export functions by name, not as defaults.
     * @param {Trackable} trackingOwner - Parent object for complex debugging.
     */
    constructor(talonPath, { exportName }, trackingOwner) {
        this._exportName = exportName;
        this._talonModule = new Targetables.ESModule(talonPath, trackingOwner);
    }

    /**
     * Delegate the method that gets the created transform requests.
     * @protected
     */
    flush() {
        return this._talonModule.flush();
    }

    /**
     * Decorate this talon using a [wrapper module](#wrapper_modules).
     *
     * @param {string} wrapperModule - Import path to the wrapper
     * module. Should be package-absolute. OR, an inline function which will be
     * serialized and injected as a virtual module.
     */
    wrapWith(wrapperModule) {
        return this._talonModule.wrapWithFile(this._exportName, wrapperModule);
    }
}

module.exports = TargetableHook;
