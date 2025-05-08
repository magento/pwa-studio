/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const formatRangeLabel = (filter, currencyRate = '1', currencySymbol = '$') => {
    const range = filter.range;

    const rate = currencyRate;
    const symbol = currencySymbol;
    const label = `${symbol}${
        range?.from && parseFloat(rate) * parseInt(range.from.toFixed(0), 10)
            ? (
                  parseFloat(rate) * parseInt(range.from?.toFixed(0), 10)
              )?.toFixed(2)
            : 0
    }${
        range?.to && parseFloat(rate) * parseInt(range.to.toFixed(0), 10)
            ? ` - ${symbol}${(
                  parseFloat(rate) * parseInt(range.to.toFixed(0), 10)
              ).toFixed(2)}`
            : ' and above'
    }`;
    return label;
};

const formatBinaryLabel = (filter, option, categoryNames, categoryPath) => {
    if (categoryPath && categoryNames) {
        const category = categoryNames.find(
            facet =>
                facet.attribute === filter.attribute && facet.value === option
        );

        if (category?.name) {
            return category.name;
        }
    }

    const title = filter.attribute?.split('_');
    if (option === 'yes') {
        return title.join(' ');
    } else if (option === 'no') {
        return `not ${title.join(' ')}`;
    }
    return option;
};

export { formatBinaryLabel, formatRangeLabel };
