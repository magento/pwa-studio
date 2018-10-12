const util = require('util');
const { basename } = require('path');
const _ = require('lodash');
const callerId = require('caller-id');
const createDebug = require('debug');

// Objects can have unsexpectedly large string representations.
// Let's try to slim them down by omitting what appear to be binary properties...
const maxStringLen = 100;
function abridge(seen, value) {
    // Avoid huge binary hex dumps
    if (_.isString(value)) {
        return value.length < maxStringLen
            ? value
            : `[Abridged(${value.slice(0, maxStringLen)})]`;
    }
    if (_.isBuffer(value)) {
        return `[Buffer(${value.length})]`;
    }
    if (
        _.isArrayLike(value) ||
        _.isRegExp(value) ||
        _.isNil(value) ||
        _.isDate(value)
    ) {
        return value;
    }
    if (_.isObject(value)) {
        if (seen.has(value)) {
            return '[Circular]';
        }
        seen.add(value);
        return _.mapValues(value, abridge.bind(null, seen));
    }
    return value;
}

createDebug.formatters.A = value => util.inspect(abridge(new Set(), value));

function createUpwardDebugger() {
    return createDebug(
        // autogenerate namespaces based on filenames
        'upward-js:' + basename(callerId.getData().filePath, '.js')
    );
}

module.exports = createUpwardDebugger;
