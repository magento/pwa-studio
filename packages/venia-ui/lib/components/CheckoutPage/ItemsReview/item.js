import React from 'react';
import { FormattedMessage } from 'react-intl';

import ProductOptions from '../../LegacyMiniCart/productOptions';
import Image from '../../Image';
import { useStyle } from '../../../classify';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import defaultClasses from './item.module.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options,
        isHidden,
        configurableThumbnailSource
    } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root_visible;
    const configured_variant = configuredVariant(configurable_options, product);
    return (
        <div className={className}>
            <Image
                alt={product.name}
                classes={{ root: classes.thumbnail }}
                width={100}
                resource={
                    configurableThumbnailSource === 'itself' &&
                    configured_variant
                        ? configured_variant.thumbnail.url
                        : product.thumbnail.url
                }
            />
            <span className={classes.name}>{product.name}</span>
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>
                <FormattedMessage
                    id={'checkoutPage.quantity'}
                    defaultMessage={'Qty : {quantity}'}
                    values={{ quantity }}
                />
            </span>
        </div>
    );
};

export default Item;
