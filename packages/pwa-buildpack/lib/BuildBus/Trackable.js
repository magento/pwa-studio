/**
 * @module @magento/pwa-buildpack
 */
const { inspect } = require('util');

/**
 * Prototype for something which knows how to serialize itself for
 * `util.inspect()` and friends.
 * @ignore
 */
const inspectable = {
    [inspect.custom](depth, options) {
        if (depth < 0) {
            return options.stylize(this.toString(), 'special');
        }
        return this;
    },
    toString() {
        return `${this.type}<${this.id}>`;
    }
};

/**
 * Partial prototype for enabled Trackable instances.
 * These are in a partial object instead of being class methods because they
 * can be expensive when the Trackable tree is deep. So, unless tracking is
 * turned on, they should be no-ops.
 * @lends Trackable.prototype
 */
const liveMethods = {
    /**
     * Serialize this Trackable and any parent Trackables.
     *
     * @returns {Object} JSON-clean object that recurses up the parent tree.
     */
    toJSON() {
        const json = Object.create(inspectable);
        json.type = this.constructor.name;
        json.id = this._ensureIdentifier();
        if (this._parent) {
            json.parent = this._parent.toJSON();
        }
        return json;
    },
    /**
     * Push an event to the parent Trackable, or, if no parent, to the root
     * output callback provided to {@link Trackable#attach}. All `.track`
     * calls are tagged with the instance's identifier and then rolled up
     * recursively until they call the root output callback.
     *
     * Throws an exception if {@link Trackable#attach} has never been called
     * on this instance.
     *
     * @param {*} args - Any params the root logging function will understand
     * @
     */
    track(...args) {
        if (!this._out) {
            throw new Error(
                'Trackable must be initialized with tracker.attach'
            );
        }
        return this._out(this.toJSON(), ...args);
    }
};

/**
 * Until tracking is turned on, these should be no-ops.
 * @ignore
 */
const deadMethods = {
    toJSON() {},
    track() {}
};

/**
 * Generic node in a tree of objects which can log their activity. Implemented
 * for BuildBus, since it will eventually need sophisticated debugging and
 * introspection for developers, but it has no BuildBus-specific functionality.
 *
 */
class Trackable {
    /**
     * Enable all active Trackable instances. **Do not run in production**.
     * Carries a possibly significant performance cost.
     */
    static enableTracking() {
        Object.assign(Trackable.prototype, liveMethods);
    }
    /**
     * Disable all active Trackable instances. The parent logging callback will
     * not be called.
     */
    static disableTracking() {
        Object.assign(Trackable.prototype, deadMethods);
    }
    /**
     * @private
     */
    _ensureIdentifier() {
        if (!this.hasOwnProperty('_identifier')) {
            throw new Error(
                'Trackable must be initialized with tracker.attach'
            );
        }
        return this._identifier;
    }
    /**
     * Attach this Trackable to a tree. Give it a name and an owner. If the
     * owner is a Trackable, then this Trackable becomes a child node of the
     * owner. If the owner is a function, then this Trackable becomes a root
     * node, which will log all of its {@link Trackable#track} calls *and* its
     * descendents' calls to the `owner` function.
     *
     * @see Trackable.spec.js
     *
     * @param {string} identifier - String identifier of this Trackable
     * @param {(Trackable | Function)} owner - Parent or root log callback
     */
    attach(identifier, owner) {
        this._identifier = identifier;
        if (owner instanceof Trackable) {
            this._parent = owner;
            this._out = (...args) => this._parent._out(...args);
        } else if (typeof owner === 'function') {
            this._out = owner;
        }
    }
}

// Always start disabled.
Trackable.disableTracking();

module.exports = Trackable;
