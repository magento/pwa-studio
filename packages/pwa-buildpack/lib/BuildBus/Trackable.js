const liveMethods = {
    toJSON() {
        if (!this.hasOwnProperty('_identifier')) {
            throw new Error(
                'Trackable must be initialized with tracker.identify'
            );
        }
        const json = {
            type: this.constructor.name,
            id: this._identifier
        };
        if (this._parent) {
            json.parent = this._parent.toJSON();
        }
        return json;
    },
    track(event, ...args) {
        if (!this._out) {
            throw new Error(
                'Trackable must be initialized with tracker.identify'
            );
        }
        return this._out({
            origin: this.toJSON(),
            event,
            args
        });
    }
};

const deadMethods = {
    toJSON() {},
    track() {}
};

class Trackable {
    static enableTracking() {
        Object.assign(Trackable.prototype, liveMethods);
    }
    static disableTracking() {
        Object.assign(Trackable.prototype, deadMethods);
    }
    identify(identifier, owner) {
        this._identifier = identifier;
        if (owner instanceof Trackable) {
            this._parent = owner;
            this._out = (...args) => this._parent._out(...args);
        } else {
            this._out = owner;
        }
    }
}

Trackable.disableTracking();

module.exports = Trackable;
