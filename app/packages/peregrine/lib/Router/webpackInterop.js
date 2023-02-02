export default {
    // https://webpack.js.org/api/module-variables/#__webpack_chunk_load__-webpack-specific-
    loadChunk:
        process.env.NODE_ENV === 'test' ? () => {} : __webpack_chunk_load__,
    // https://webpack.js.org/api/module-variables/#__webpack_require__-webpack-specific-
    require: process.env.NODE_ENV === 'test' ? () => {} : __webpack_require__
};
