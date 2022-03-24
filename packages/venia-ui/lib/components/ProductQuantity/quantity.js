import React from 'react';
import { useIntl } from 'react-intl';
import { arrayOf, number, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import Select from '../Select';
import mockData from './mockData';
import defaultClasses from './quantity.module.css';

/**
 * @deprecated
 */
const Quantity = props => {
    const { classes: propClasses, selectLabel, ...restProps } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <Select
                {...restProps}
                field="quantity"
                aria-label={formatMessage({
                    id: 'productQuantity.label',
                    defaultMessage: selectLabel
                })}
                items={mockData}
            />
        </div>
    );
};
Quantity.propTypes = {
    classes: shape({
        root: string
    }),
    items: arrayOf(
        shape({
            value: number
        })
    )
};

Quantity.defaultProps = {
    selectLabel: "product's quantity"
};

export default Quantity;
