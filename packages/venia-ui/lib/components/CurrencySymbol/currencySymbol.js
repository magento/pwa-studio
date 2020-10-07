import React, { useEffect, useState } from 'react';
import { FormattedNumberParts } from 'react-intl';
import { string, shape } from 'prop-types';
import { shouldPolyfill } from '@formatjs/intl-numberformat/should-polyfill';

const polyfill = async () => {
    await import('@formatjs/intl-numberformat/polyfill');
    if (Intl.NumberFormat.polyfilled) {
        await import('@formatjs/intl-numberformat/locale-data/en');
    }
};

/**
 * The CurrencySymbol component is used to extract currency symbol from Intl.NumberFormat.
 * https://formatjs.io/docs/react-intl/components/#formattednumberparts
 */
const CurrencySymbol = props => {
    const { currencyCode, currencyDisplay, classes } = props;
    const [pollyfilled, setPollyfilled] = useState(false);

    const partsMap = (part, i) => {
        const key = `${i}-${part.value}`;
        return (
            part.type === 'currency' && (
                <span key={key} className={classes.currency}>
                    {part.value}
                </span>
            )
        );
    };

    useEffect(() => {
        if (shouldPolyfill()) {
            polyfill().then(() => {
                setPollyfilled(true);
            });
        }
    }, [setPollyfilled]);

    if (shouldPolyfill() && !pollyfilled) return null;

    return (
        <FormattedNumberParts
            value={0}
            currencyDisplay={currencyDisplay}
            style="currency"
            currency={currencyCode}
        >
            {parts => parts.map(partsMap)}
        </FormattedNumberParts>
    );
};

CurrencySymbol.propTypes = {
    /**
     * Class names to use when styling this component
     */
    classes: shape({
        currency: string
    }),
    /**
     * A string with any of the currency code supported by Intl.NumberFormat
     */
    currencyCode: string.isRequired,
    /**
     * Currency display types supported by Intl.NumberFormat
     */
    currencyDisplay: string
};

CurrencySymbol.defaultProps = {
    classes: {},
    currencyDisplay: 'symbol'
};

export default CurrencySymbol;
