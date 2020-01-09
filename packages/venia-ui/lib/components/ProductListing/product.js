import React from 'react';
import { useProduct } from '@magento/peregrine/lib/talons/ProductListing/useProduct';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import Image from '../Image';
import defaultClasses from './product.css';

const Product = props => {
    const { item } = props;
    const talonProps = useProduct({ item });
    const { image, name, quantity, unitPrice } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <li className={classes.root}>
            <Image
                alt={name}
                classes={{ image: classes.image, root: classes.imageContainer }}
                width={100}
                src={image}
            />
            <span className={classes.name}>{name}</span>
            <span className={classes.options}>Options</span>
            <span className={classes.unitPrice}>
                <Price currencyCode="USD" value={unitPrice} />
                {' ea.'}
            </span>
            <div className={classes.quantity}>- {quantity} +</div>
            <div className={classes.kebab}>Kebab</div>
        </li>
    );
};

export default Product;
