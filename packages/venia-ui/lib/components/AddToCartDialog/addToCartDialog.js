import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useAddToCartDialog } from '@magento/peregrine/lib/talons/AddToCartDialog/useAddToCartDialog';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import Dialog from '../Dialog';
import Image from '../Image';
import Price from '../Price';
import Options from '../ProductOptions';
import defaultClasses from './addToCartDialog.css';

const AddToCartDialog = props => {
    const { item } = props;

    const talonProps = useAddToCartDialog(props);
    const {
        buttonProps,
        configurableOptionProps,
        handleOnClose,
        imageProps,
        priceProps
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const imageComponent = imageProps ? (
        <Image {...imageProps} classes={{ image: classes.image }} />
    ) : (
        <div className={classes.image} />
    );

    const priceComponent = priceProps ? <Price {...priceProps} /> : null;

    const dialogContent = useMemo(() => {
        if (item) {
            return (
                <div className={classes.root}>
                    {imageComponent}
                    <div className={classes.detailsContainer}>
                        <span className={classes.name}>
                            {item.product.name}
                        </span>
                        <span className={classes.price}>{priceComponent}</span>
                        <Options
                            {...configurableOptionProps}
                            classes={{
                                root: undefined,
                                title: classes.optionTitle
                            }}
                        />
                        <Button {...buttonProps}>
                            <FormattedMessage
                                id="addToCartDialog.addToCart"
                                defaultMessage="Add to Cart"
                            />
                        </Button>
                    </div>
                </div>
            );
        }

        return null;
    }, [
        buttonProps,
        classes.detailsContainer,
        classes.name,
        classes.optionTitle,
        classes.price,
        classes.root,
        configurableOptionProps,
        imageComponent,
        item,
        priceComponent
    ]);

    return (
        <Dialog
            shouldShowButtons={false}
            isOpen={!!props.item}
            onCancel={handleOnClose}
        >
            {dialogContent}
        </Dialog>
    );
};

export default AddToCartDialog;

AddToCartDialog.propTypes = {
    classes: shape({
        root: string,
        image: string,
        detailsContainer: string,
        name: string,
        price: string,
        optionTitle: string
    }),
    item: shape({
        product: shape({
            name: string.isRequired
        }).isRequired
    })
};
