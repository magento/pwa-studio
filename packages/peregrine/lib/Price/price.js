import React, { PureComponent, Fragment } from 'react';
import { number, string, shape } from 'prop-types';
import patches from '../util/intlPatches';

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
export default class Price extends PureComponent {
    static propTypes = {
        /**
         * The numeric price
         */
        value: number.isRequired,
        /**
         * A string with any of the currency code supported by Intl.NumberFormat
         */
        currencyCode: string.isRequired,
        /**
         * Class names to use when styling this component
         */
        classes: shape({
            currency: string,
            integer: string,
            decimal: string,
            fraction: string
        }),
        /**
         * A string with a BCP 47 language tag to be used in Intl.NumberFormat constructor
         */
        locale: string
    };

    static defaultProps = {
        classes: {}
    };

    render() {
        const { value, currencyCode, classes, locale } = this.props;

        // If the optional locale prop is not provided or is undefined,
        // the runtime's default locale is used in the Intl.NumberFormat() constructor.
        const parts = patches.toParts.call(
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currencyCode
            }),
            value
        );

        const children = parts.map((part, i) => {
            const partClass = classes[part.type];
            const key = `${i}-${part.value}`;

            return (
                <span key={key} className={partClass}>
                    {part.value}
                </span>
            );
        });

        return <Fragment>{children}</Fragment>;
    }
}
