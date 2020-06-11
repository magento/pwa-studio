/**
 * Helper class for mocking values in objects--say, like `process.env`-- safely
 * in Jest test bodies. Much better than mocking dotenv and envalid.
 *
 * @class MockProps
 */
class MockProps {
    /**
     * Creates an instance of MockProps for a test suite.
     * @param {Object} actual - The object on which to mock and unmock properties.
     * @param {Function} afterEach - The Jest `afterEach` lifecycle function, which MockProps will use to restore the original object after every test.
     */
    constructor(actual, afterEach) {
        /**
         * Set a property to `this.UNSET` to mock-unset it.
         */
        this.UNSET = Symbol('FLAG_FOR_UNSET');
        this._actual = actual;
        this._stored = new Map();
        afterEach(() => this._unmock());
    }
    /**
     * Set properties on the actual object, while storing their original values for
     * later unmocking. To simulate a property being unset, pass the value
     * `this.UNSET`.
     *
     * @param {Object} props - Properties to populate on the actual object until the test is complete.
     */
    set(props) {
        for (const [name, mockValue] of Object.entries(props)) {
            // If it's already been mocked, don't overwrite.
            if (!this._stored.has(name)) {
                // If it wasn't originally there, store our flag for deletion.
                const original = this._actual.hasOwnProperty(name)
                    ? this._actual[name]
                    : this.UNSET;
                this._stored.set(name, original);
            }
            this._overwrite(name, mockValue);
        }
    }
    /**
     * Restore the original values of all mocked props to the actual object.
     * @private
     */
    _unmock() {
        for (const [name, original] of this._stored.entries()) {
            this._overwrite(name, original);
        }
        this._stored.clear();
    }
    /**
     * Overwrite the actual object temporarily with this value.
     *
     * @param {string} name - Property name
     * @param {*} value - Value to mock (or the UNSET symbol to mock delete)
     * @private
     */
    _overwrite(name, value) {
        if (value === this.UNSET) {
            delete this._actual[name];
        } else {
            this._actual[name] = value;
        }
    }
}

module.exports = MockProps;
