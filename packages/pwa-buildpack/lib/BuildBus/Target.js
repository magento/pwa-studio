/**
 * Represents an edge on the graph, or a "route" between stops, created between
 * two extensions when one of them references the target(s) of another. When
 * extension Foo requests targets of extension Bar, the BuildBus provides an
 * Target instead of the literal Tapable instance. This enables
 * better logging, error checking, and validation.
 */
const Trackable = require('./Trackable');

class Target extends Trackable {
    constructor(owner, requestor, targetName, tapableType, tapable) {
        super();
        this._tapable = tapable;
        this._requestor = requestor;
        this.identify(`${targetName}[${tapableType}]`, owner);
    }
    _invokeTap(method, customName, tap) {
        let interceptor = tap;
        let tapName = this._requestor;
        if (interceptor) {
            // a custom name was passed!
            tapName = `${this._requestor}:${customName}`;
        } else {
            interceptor = customName;
        }
        this.track(method, {
            requestor: this._requestor,
            interceptor: tapName
        });
        return this._tapable[method](tapName, interceptor);
    }
    call(...args) {
        this.track('call', ...args);
        return this._tapable.call(...args);
    }
    intercept(options) {
        this.track('tapableIntercept', options);
        return this._tapable.intercept(options);
    }
    tap(name, interceptor) {
        return this._invokeTap('tap', name, interceptor);
    }
    tapAsync(name, interceptor) {
        return this._invokeTap('tapAsync', name, interceptor);
    }
    tapPromise(name, interceptor) {
        return this._invokeTap('tapPromise', name, interceptor);
    }
}

module.exports = Target;
