import React, { useMemo } from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';

import defaultClasses from './productOptions.css';

const ProductOptions = props => {
    const { options = [] } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const displayOptions = useMemo(
        () =>
            options.map(({ option_label, value_label }) => {
                const key = `${option_label}${value_label}`;

                return (
                    <div key={key} className={classes.optionLabel}>
                        {/**
                         * Added `\u00a0` to simulate a space character.
                         * We can't use ` ` because JS string lirerals logic
                         * does not allow leading or trailing space chaacters.
                         */}
                        <dt>{`${option_label} :\u00a0`}</dt>
                        <dd>{value_label}</dd>
                    </div>
                );
            }),
        [classes.optionLabel, options]
    );

    if (displayOptions.length === 0) {
        return null;
    }

    return <dl className={classes.options}>{displayOptions}</dl>;
};

ProductOptions.propTypes = {
    options: arrayOf(
        shape({
            label: string,
            value: string
        })
    )
};

export default ProductOptions;
