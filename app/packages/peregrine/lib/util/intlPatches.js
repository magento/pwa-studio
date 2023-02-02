/**
 * A [ponyfill](https://github.com/sindresorhus/ponyfill) is an opt-in polyfill,
 * which replaces missing builtins on older or non-compliant platforms, but
 * without monkey-patching the native API.
 *
 * Many browsers do not yet support Intl.NumberFormat.prototype.formatToParts,
 * which is tracked here: https://github.com/tc39/proposal-intl-formatToParts
 *
 * The polyfill available in that repository covers many edge cases, but it's
 * more functionality than we need at this stage, it's not distributed over
 * NPM, and it's 18kb. The below
 * [ponyfill](https://github.com/sindresorhus/ponyfill) is not fully compliant,
 * but it'll do for now.
 *
 * TODO: Replace with a formally maintained, but small-enough, ponyfill.
 */

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
        decimal: '.',
        groupDelim: ','
    }
};

const IntlPatches = {
    formatToPartsPatch({ currency, maximumFractionDigits, useGrouping }, num) {
        const format = intlFormats[currency] || {
            ...intlFormats.USD,
            symbol: currency
        };
        const { symbol, decimal, groupDelim } = format;
        const parts = [{ type: 'currency', value: symbol }];

        const [integer, fraction] = num
            .toFixed(maximumFractionDigits)
            .match(/\d+/g);

        if (useGrouping !== false) {
            const intParts = [];
            const firstGroupLength = integer.length % 3;
            let integerSlice = integer;
            if (firstGroupLength > 0) {
                intParts.push(
                    JSON.stringify({
                        type: 'integer',
                        value: integer.slice(0, firstGroupLength)
                    })
                );
                integerSlice = integer.slice(firstGroupLength);
            }

            const groups = integerSlice.match(/\d{3}/g);

            if (groups) {
                intParts.push(
                    ...groups.map(intPart =>
                        JSON.stringify({
                            type: 'integer',
                            value: intPart
                        })
                    )
                );
            }

            const groupDelimJSON =
                ',' +
                JSON.stringify({
                    type: 'group',
                    value: groupDelim
                }) +
                ',';

            const intAndGroupParts = JSON.parse(
                `[${intParts.join(groupDelimJSON)}]`
            );

            parts.push(...intAndGroupParts);
        } else {
            parts.push({ type: 'integer', value: integer });
        }
        return parts.concat([
            { type: 'decimal', value: decimal },
            { type: 'fraction', value: fraction }
        ]);
    },

    toParts(num) {
        return this.formatToParts
            ? this.formatToParts(num)
            : IntlPatches.formatToPartsPatch(this.resolvedOptions(), num);
    }
};
export default IntlPatches;
