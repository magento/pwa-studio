import React, { Fragment, useMemo } from 'react';
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
                    <Fragment key={key}>
                        <dt className={classes.optionLabel}>
                            {option_label} : {value_label}
                        </dt>
                    </Fragment>
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
