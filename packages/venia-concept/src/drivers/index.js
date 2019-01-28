export { Query } from 'react-apollo';
export { Link, Redirect, Route } from 'react-router-dom';
export { default as ResourceUrl } from './resourceUrl';
export { default as Adapter } from './adapter';
export { connect } from 'react-redux';

/**
 * Venia components must be portable and consumable by projects which want to
 * use them individually. They must work independently of the Venia app at a
 * high level and a low level. This means that their dependencies which rely
 * on external objects, like Redux stores and GraphQL clients, must be modular
 * and encapsulated.
 *
 * But, to keep the code simple to read and write, Venia does not do runtime
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
 *         "@magento-venia/drivers": "./myReplacementDrivers"
 *       }
 *     }
 */
