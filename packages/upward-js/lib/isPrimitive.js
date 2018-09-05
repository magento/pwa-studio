const { isBoolean, isFinite, isString } = require('lodash');

const isPrimitive = v => isBoolean(v) || isString(v) || isFinite(v);
module.exports = isPrimitive;
