import React, { useMemo, Fragment } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './addProductBySku.module.css';
import Image from '@magento/venia-ui/lib/components/Image';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';
import Button from '@magento/venia-ui/lib/components/Button';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useAddProductBySku } from '@magento/peregrine/lib/talons/RequestQuote/QuotePage/useAddProductBySku';

const IMAGE_WIDTH = 60;

const AddProductBySku = props => {
    const { products, isFatching, handleAddItemBySku, handleSearchData } = useAddProductBySku();

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const formClass = classes.entryForm;

    const fatchingComponents = useMemo(() => {
        if (isFatching) {
            return (
                <div className={classes.message}>
                    <FormattedMessage id={'addProductBySku.add'} defaultMessage={'Fetching Details...'} />
                </div>
            );
        } else {
            return null;
        }
    });

    const productComponents = useMemo(() => {
        if (products) {
            return products.map(product => (
                <Form className={formClass} onSubmit={() => handleAddItemBySku(product.sku)} key={product.sku}>
                    <div className={classes.productLeft}>
                        <Link
                            className={classes.thumbnailContainer}
                            to={resourceUrl('/' + product.url_key + product.url_suffix)}
                        >
                            <Image
                                alt={product.name}
                                classes={{ image: classes.thumbnail, root: classes.image }}
                                resource={product.small_image.url}
                                width={IMAGE_WIDTH}
                            />
                        </Link>
                        <div className={classes.productNameCol}>
                            <span className={classes.name}>{product.name}</span>
                            <span className={classes.price}>
                                <Price
                                    currencyCode={product.price.regularPrice.amount.currency}
                                    value={product.price.regularPrice.amount.value}
                                />
                            </span>
                        </div>
                    </div>
                    {product.type_id == 'simple' && (
                        <Field>
                            <Button disabled={false} priority={'normal'} type={'submit'}>
                                <FormattedMessage id={'addProductBySku.add'} defaultMessage={'Add'} />
                            </Button>
                        </Field>
                    )}
                </Form>
            ));
        }
    }, [products]);

    return (
        <div className={classes.root}>
            <Field
                id="mrfq-sku-input"
                label={formatMessage({
                    id: 'addProductBySku.addProductBySkuText',
                    defaultMessage: 'Search Product'
                })}
            >
                <TextInput onKeyUp={handleSearchData} field="searchProduct" id={'searchProduct'} />
            </Field>
            <div className={classes.dropdownProductCol}>
                {fatchingComponents}
                {products.length > 0 && (
                    <div className={classes.dropdownProduct}>
                        <Fragment>{productComponents}</Fragment>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddProductBySku;

AddProductBySku.propTypes = {
    classes: shape({
        root: string
    })
};
