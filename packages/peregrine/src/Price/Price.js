import React, { PureComponent, Fragment } from 'react';
import { number, string, shape } from 'prop-types';

// cheap enabler for showstopper bugs in safari et. al.
// TODO: replace with proper polyfill
const intlFormats = {
    USD: {
        symbol: '$',
        decimal: '.',
        groupDelim: ','
    },
    GBP: {
        symbol: '£',
        decimal: '.',
        groupDelim: ','
    },
    EUR: {
        symbol: '€',
        decimal: ',',
        groupDelim: '.'
    }
};
const toParts =
    Intl.NumberFormat.prototype.formatToParts ||
    function(num) {
        const {
            currency,
            maximumFractionDigits,
            useGrouping
        } = this.resolvedOptions();
        const { symbol, decimal, groupDelim } =
            intlFormats[currency] || intlFormats['USD'];
        let [integer, fraction] = num
            .toFixed(maximumFractionDigits)
            .match(/\d+/g);
        if (useGrouping) {
            integer = integer
                .split('')
                .reverse()
                .join('')
                .replace(/(\d{3})/g, `$1${groupDelim}`)
                .split('')
                .reverse()
                .join('');
        }
        return [{ currency: symbol }, { integer }, { decimal }, { fraction }];
    };

export default class Price extends PureComponent {
    static propTypes = {
        value: number.isRequired,
        currencyCode: string.isRequired,
        classes: shape({
            currency: string,
            integer: string,
            decimal: string,
            fraction: string
        })
    };

    static defaultProps = {
        classes: {}
    };

    render() {
        const { value, currencyCode, classes } = this.props;

        const parts = toParts.call(
            Intl.NumberFormat(undefined, {
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
