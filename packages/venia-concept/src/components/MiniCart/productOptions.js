import React, { Fragment } from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';

import defaultClasses from './productOptions.css';

const ProductOptions = props => {
    const { options } = props;

    if (!options || options.length === 0) {
        return null;
    }

    const classes = mergeClasses(defaultClasses, props.classes);
    const displayOptions = options.map(({ label, value }) => {
        const key = `${label}${value}`;

        return (
            <Fragment key={key}>
                <dt className={classes.optionLabel}>
                    {label} : {value}
                </dt>
            </Fragment>
        );
    });

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
