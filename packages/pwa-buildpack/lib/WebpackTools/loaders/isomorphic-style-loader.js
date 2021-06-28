/**
 * Derived from isomorphic-style-loader, property of Kriasoft and licensed under
 * the MIT license as defined in the following repository:
 *
 * https://github.com/kriasoft/isomorphic-style-loader
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const { stringifyRequest } = require('loader-utils');

module.exports = function loader() {};
module.exports.pitch = function pitch(request) {
    if (this.cacheable) {
        this.cacheable();
    }

    const insertCss = require.resolve('../insertCss.js');
    return `
    var refs = 0;
    var css = require(${stringifyRequest(this, `!!${request}`)});
    var insertCss = require(${stringifyRequest(this, `!${insertCss}`)});
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;
    exports = module.exports = css.locals || {};
    exports._getContent = function() { return content; };
    exports._getCss = function() { return '' + css; };
    exports._insertCss = function(options) { return insertCss(content, options) };
    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (module.hot && globalThis.document) {
      var removeCss = function() {};
      module.hot.accept(${stringifyRequest(this, `!!${request}`)}, function() {
        css = require(${stringifyRequest(this, `!!${request}`)});
        content = typeof css === 'string' ? [[module.id, css, '']] : css;
        removeCss = insertCss(content, { replace: true });
      });
      module.hot.dispose(function() { removeCss(); });
    }
  `;
};
