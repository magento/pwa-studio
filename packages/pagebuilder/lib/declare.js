/**
 * These targets are available for interception to modules which depend on `@magento/pagebuilder`.
 *
 * Their implementations are found in `./intercept.js`.
 *
 */
module.exports = targets => {
    targets.declare({
        /**
         * Provides access to Pagebuilder custom content types
         *
         * @member {tapable.SyncHook}
         *
         * @see [Intercept function signature]{@link rendererInterceptFunction}
         * @see [CustomContentTypeList]{@link #CustomContentTypeList}
         * @see [Pagebuilder]{@link Pagebuilder}
         * @see [RichContent]{@link RichContent}
         *
         * @example <caption>Add a custom content type</caption>
         * targets.of('@magento/pagebuilder').customContentTypes.tap(
         *   contentTypes => contentTypes.add({
         *     contentType: 'AdobeXMC',
         *     importPath: '@adobe/xm-components/xm-content-type'
         *   })
         * );
         */
        customContentTypes: new targets.types.Sync(['contentTypes'])
    });
};

/** Type definitions related to: customContentTypeRenderers */

/**
 * Custom content types for the Pagebuilder component must implement this
 * interface. Should be written as an ES Module—a module that exports functions
 * with these names, rather than an object with these functions as properties.
 *
 * @typedef {Object} CustomContentType
 * @interface
 * @property {React.Component} Component - The React component that does the actual rendering.
 * @property {function} configAggregator - Function that receives the content to be rendered as
 * @property {string} data content type name should be the same data-content-type=""
 *
 * @example <caption>A component that can render content data-content-type="zlider"</caption>
 * ```jsx
 * import React from 'react';
 * import Component from './zlider';
 *
 * const configAggregator = (node, props) => {
 * const attributeName = 'data-mage-init';
 * const attribute = node && node.hasAttribute(attributeName) ? node.getAttribute(attributeName) : false;
 * if (!attribute) {
 *     return;
 * }
 * const config = JSON.parse(attribute);
 *   return {
 *       config
 *   };
 * }
 * export default {
 *   name: 'zlider',
 *   configAggregator,
 *   component: Component
 * }
 * ```
 *
 */
