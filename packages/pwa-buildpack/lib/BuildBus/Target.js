/**
 * @module Buildpack/BuildBus
 */

const Trackable = require('./Trackable');

const interceptionTypes = {
    tap: 'sync',
    tapAsync: 'async',
    tapPromise: 'promise'
};

/**
 * Represents an edge on the graph, or a "route" between stops, created between
 * two extensions when one of them references the target(s) of another. When
 * extension Foo requests targets of extension Bar, the BuildBus provides an
 * Target instead of the literal Tapable instance. This enables
 * better logging, error checking, and validation.
 *
 * @class Target
 * @extends {Trackable}
 */
class Target extends Trackable {
    static get SOURCE_SEP() {
        return '::';
    }
    constructor(owner, requestor, targetName, tapableType, tapable) {
        super();
        this._owner = owner;
        this._tapable = tapable;
        this._requestor = requestor;
        this.name = targetName;
        this.type = tapableType;
        this.attach(`${targetName}[${tapableType}]`, this._owner);
    }
    /** @ignore */
    _invokeTap(method, info, fn) {
        const tapInfo = {
            name: this._requestor
        };
        let customName;
        if (typeof info === 'object') {
            // a tapInfo object was passed! extract its name...
            const { name, ...otherInfo } = info;
            customName = name;
            Object.assign(tapInfo, otherInfo);
        } else if (fn) {
            // a custom name and tap function were passed!
            customName = info;
            tapInfo.fn = fn;
        } else {
            // a tap function was passed with no custom name
            tapInfo.fn = info;
        }
        if (customName) {
            tapInfo.name += Target.SOURCE_SEP + customName;
        }
        this.track('intercept', {
            source: this._requestor,
            type: interceptionTypes[method]
        });
        return this._tapable[method](tapInfo);
    }
    /**
     * Run `.call(...args)` on the underlying Tapable Hook.
     * Calls interceptors synchronously and in subscription order with the
     * provided arguments. Returns the final value if it's a Waterfall target,
     * or the value returned by the first interceptor that returns a value if
     * it's a Bail target.
     * @memberof Target
     */
    call(...args) {
        this.track('beforeCall', { type: 'sync', args });
        const returned = this._tapable.call(...args);
        this.track('afterCall', { type: 'sync', returned });
        return returned;
    }
    /**
     * Run `.callAsync(...args)` on the underlying Tapable Hook. Calls
     * interceptors asynchronously with the provided arguments. Depending on
     * the Target type, calls interceptors in parallel or in subscription
     * order. Last argument must be a callback. It will be invoked when all
     * interceptors have run, or when the first returning interceptor has run
     * if it's a Bail target.
     * @memberof Target
     */
    callAsync(...incomingArgs) {
        const callbackIndex = incomingArgs.length - 1;
        const callback = incomingArgs[callbackIndex];
        const args = incomingArgs.slice(0, callbackIndex);
        this.track('beforeCall', { type: 'async', args });
        args.push((...returned) => {
            this.track('afterCall', { type: 'async', returned });
            callback(...returned);
        });
        return this._tapable.callAsync(...args);
    }
    /**
     * Run `.intercept(options)` on the underlying Tapable Hook.
     * Can register meta-interceptors for other activity on this target.
     * Use only for logging and debugging.
     * @memberof Target
     */
    intercept(options) {
        this.track('intercept', {
            type: 'intercept',
            source: this._requestor,
            options
        });
        return this._tapable.intercept(options);
    }
    /**
     * Run `.promise(...args)` on the underlying Tapable hook. Calls
     * interceptors asynchronously with the provided arguments. Depending on
     * the Target type, calls interceptors in parallel or in series. Returns a
     * promise. It will be fulfilled when all interceptors have run, or when
     * the first returning interceptor has run if it's a Bail target.
     */
    promise(...args) {
        this.track('beforeCall', { type: 'promise', args });
        return this._tapable.promise(...args).then(returned => {
            this.track('afterCall', { type: 'promise', returned });
            return returned;
        });
    }
    /**
     *
     */
    tap(name, interceptor) {
        return this._invokeTap('tap', name, interceptor);
    }
    tapAsync(name, interceptor) {
        return this._invokeTap('tapAsync', name, interceptor);
    }
    tapPromise(name, interceptor) {
        return this._invokeTap('tapPromise', name, interceptor);
    }
    toJSON() {
        const json = super.toJSON();
        if (json) {
            json.requestor = this._requestor;
        }
        return json;
    }
}

Target.External = class ExternalTarget extends Target {
    _throwOnExternalInvoke(method) {
        throw new Error(
            `${this._requestor} ran targets.of("${this._owner.name}").${
                this.name
            }.${method}(). Only ${
                this._owner.name
            } can invoke its own targets. ${
                this._requestor
            } can only intercept them.`
        );
    }
    call() {
        this._throwOnExternalInvoke('call');
    }
    callAsync() {
        this._throwOnExternalInvoke('callAsync');
    }
    promise() {
        this._throwOnExternalInvoke('promise');
    }
};

module.exports = Target;
