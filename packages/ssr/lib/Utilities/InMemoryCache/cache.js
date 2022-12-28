'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.default = void 0;

var _client = require('@apollo/client');

function createCache() {
    return new _client.InMemoryCache();
}

var _default = {
    InMemoryCache: _client.InMemoryCache,
    createCache
};
exports.default = _default;
