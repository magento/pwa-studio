import React, { useMemo } from 'react';
import { useAddToCartDialog } from '@magento/peregrine/lib/talons/AddToCartDialog/useAddToCartDialog';

import { mergeClasses } from '../../classify';
import Dialog from '../Dialog';
import Image from '../Image';
import defaultClasses from './addToCartDialog.css';
import Price from '../Price';
import Options from '../ProductOptions';
import Button from '../Button';

const AddToCartDialog = props => {
    const { item, onClose } = props;

    const talonProps = useAddToCartDialog({ item });
    const { configurableOptionProps, imageProps, priceProps } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const imageComponent = imageProps ? (
        <Image {...imageProps} classes={{ image: classes.image }} />
    ) : (
        <div className={classes.image} />
    );

    const dialogContent = useMemo(() => {
        if (item) {
            return (
                <div className={classes.root}>
                    {imageComponent}
                    <div className={classes.detailsContainer}>
                        <span className={classes.name}>
                            {item.product.name}
                        </span>
                        <span className={classes.price}>
                            <Price {...priceProps} />
                        </span>
                        <Options
                            {...configurableOptionProps}
                            classes={{
                                root: undefined,
                                title: classes.optionTitle
                            }}
                        />
                        <Button priority="high">Add to Cart</Button>
                    </div>
                </div>
            );
        }

        return null;
    }, [classes, configurableOptionProps, imageComponent, item, priceProps]);

    return (
        <Dialog
            shouldShowButtons={false}
            isOpen={!!props.item}
            onCancel={onClose}
        >
            {dialogContent}
        </Dialog>
    );
};

export default AddToCartDialog;
