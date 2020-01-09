import React from 'react';
import { useProduct } from '@magento/peregrine/lib/talons/ProductListing/useProduct';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import Kebab from '../MiniCart/kebab';
import ProductOptions from '../MiniCart/productOptions';
import Section from '../MiniCart/section';
import Image from '../Image';
import defaultClasses from './product.css';

const Product = props => {
    const { item } = props;
    const talonProps = useProduct({ item });
    const { image, name, options, quantity, unitPrice } = talonProps;

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
            <ProductOptions options={options} />
            <span className={classes.price}>
                <Price currencyCode="USD" value={unitPrice} />
                {' ea.'}
            </span>
            {/** Quantity Selection to be completed by PWA-119. */}
            <div className={classes.quantity}>- {quantity} +</div>
            <Kebab classes={{ root: classes.kebab }}>
                <Section
                    text="Move to favorites"
                    onClick={() => {}}
                    icon="Heart"
                    isFilled={false}
                    classes={{ text: classes.sectionText }}
                />
                <Section
                    text="Edit item"
                    onClick={() => {}}
                    icon="Edit2"
                    classes={{ text: classes.sectionText }}
                />
                <Section
                    text="Remove from cart"
                    onClick={() => {}}
                    icon="Trash"
                    classes={{ text: classes.sectionText }}
                />
            </Kebab>
        </li>
    );
};

export default Product;
