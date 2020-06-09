/**
 * The **Price** component is used anywhere a price needs to be displayed.
 *
 * Formatting of prices and currency symbol selection is handled entirely by the ECMAScript Internationalization API available in modern browsers.
 *
 * A [polyfill][] is required for any JavaScript runtime that does not have [Intl.NumberFormat.prototype.formatToParts][].
 *
 * [polyfill]: https://www.npmjs.com/package/intl
 * [Intl.NumberFormat.prototype.formatToParts]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
 */
export default class Price extends React.PureComponent<any, any, any> {
    static propTypes: {
        /**
         * The numeric price
         */
        value: import("prop-types").Validator<number>;
        /**
         * A string with any of the currency code supported by Intl.NumberFormat
         */
        currencyCode: import("prop-types").Validator<string>;
        /**
         * Class names to use when styling this component
         */
        classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            currency: import("prop-types").Requireable<string>;
            integer: import("prop-types").Requireable<string>;
            decimal: import("prop-types").Requireable<string>;
            fraction: import("prop-types").Requireable<string>;
        }>>;
    };
    static defaultProps: {
        classes: {};
    };
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
}
import React from "react";
