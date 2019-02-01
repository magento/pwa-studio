export { Query } from 'react-apollo';
export { Link, Redirect, Route } from 'react-router-dom';
export { default as resourceUrl } from '../util/makeUrl';
export { default as Adapter } from './adapter';
export { connect } from 'react-redux';

/**
 * Venia components must be portable and consumable by projects which want to
 * use them individually. They must work independently of the Venia app at a
 * high level and a low level. This means that their dependencies which rely
 * on external objects, like Redux stores and GraphQL clients, must be modular
 * and encapsulated.
 *
 * ## Example (not real)
 *
 * ```jsx
 * import React, { Component } from 'react';
 * import { Link, resourceUrl } from '@magento/venia-drivers';
 *
 * export default function ProductThumbnail({ name, href, size, src }) {
 *   return (
 *     <Link to={resourceUrl(href)}>
 *       <img
 *         alt={name}
 *         src={resourceUrl(src, { type: 'image-product', size: 100 })}
 *       />
 *     </Link>
 *   );
 * }
 * ```
 *
 * Venia components build URLs based on assumptions about the local origin,
 * which are declared in venia-upward.yml. Nevertheless, third parties will use
 * Venia components outside of the app which defines those UPWARD requirements.
 *
 * Therefore, Venia uses the `resourceUrl()` function to generate all URLs, and
 * components consume it as an export of the drivers module. Consumers can
 * override `resourceUrl` and even use the original implementation by importing
 * directly from the non-aliased Venia module:
 *
 * ```js
 * import { resourceUrl as veniaResourceUrl } from '@magento/venia-concept/esm/drivers';
 *
 * const proxyBase = new URL('/proxy-to-store', window.location.origin);
 * export function resourceUrl(...args) {
 *   const url = veniaResourceUrl(...args);
 *   return URL(url, proxyBase);
 * }
 * ```
 *
 * To keep the code simple to read and write, Venia does not do runtime
 * dependency injection; instead, its code declares static dependencies on
 * this centralized module. This module collects these app-level dependencies
 * used throughout the app, so that a Venia consumer can inject alternate
 * components by configuring the module resolver in their build system.
 *
 * Because this is all one file, a third party can use a Venia component that
 * contains <Query> and <Link> elements, even without an Apollo client or
 * a React Router in context, simply by adding this Webpack config:
 *
 *     module: {
 *       alias: {
 *         "@magento/venia-drivers": "./myReplacementDrivers"
 *       }
 *     }
 */
