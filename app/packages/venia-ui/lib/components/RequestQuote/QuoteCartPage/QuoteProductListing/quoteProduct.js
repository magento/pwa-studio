import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Kebab from '@magento/venia-ui/lib/components/LegacyMiniCart/kebab';
import Section from '@magento/venia-ui/lib/components/LegacyMiniCart/section';
import Image from '@magento/venia-ui/lib/components/Image';
import QuoteProductOptions from './quoteProductOptions';
import defaultClasses from './quoteProduct.module.css';
import QuoteQuantity from './quoteQuantity';
import { useQuoteProduct } from '@magento/peregrine/lib/talons/RequestQuote/QuotePage/useQuoteProduct';

const IMAGE_SIZE = 100;

const QuoteProduct = props => {
    const { item, setActiveEditItem, setIsCartUpdating } = props;

    const { id, qty, product, prices, configurable_options } = item;

    const talonProps = useQuoteProduct({
        item,
        setActiveEditItem,
        setIsCartUpdating
    });

    const { handleRemoveFromCart, handleUpdateItemQuantity } = talonProps;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const itemLink = useMemo(() => resourceUrl('/' + product.url_key + product.url_suffix), [product]);

    return (
        <li className={classes.root}>
            <div className={classes.item}>
                <Link to={itemLink} className={classes.imageContainer}>
                    <Image
                        classes={{
                            root: classes.imageRoot,
                            image: classes.image
                        }}
                        alt={product.name}
                        width={IMAGE_SIZE}
                        src={product.thumbnail.url}
                    />
                </Link>
                <div className={classes.details}>
                    <div className={classes.name}>
                        <Link to={itemLink}>
                            <FormattedMessage id={'quoteProduct.productName'} defaultMessage={product.name} />
                        </Link>
                    </div>
                    <QuoteProductOptions
                        options={configurable_options}
                        classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}
                    />
                    <div className={classes.priceBox}>
                        <span className={classes.priceLabel}>
                            <FormattedMessage id={'quoteProduct.originalPrice'} defaultMessage={'Original Price : '} />
                        </span>
                        <span className={classes.price}>
                            <Price currencyCode={prices.row_total.currency} value={prices.row_total.value} />
                        </span>
                    </div>
                    <div className={classes.priceBox}>
                        <span className={classes.priceLabel}>
                            <FormattedMessage id={'quoteProduct.quotePrice'} defaultMessage={'Quote Price : '} />
                        </span>
                        <span className={classes.price}>
                            <Price currencyCode={prices.row_total.currency} value={prices.row_total.value} />
                        </span>
                    </div>
                    <div className={classes.quantity}>
                        <QuoteQuantity itemId={id} initialValue={qty} onChange={handleUpdateItemQuantity} />
                    </div>
                </div>
                <Kebab
                    classes={{
                        root: classes.kebab
                    }}
                >
                    <Section
                        text={formatMessage({
                            id: 'quoteProduct.removeFromQuoteCart',
                            defaultMessage: 'Remove from Quote cart'
                        })}
                        onClick={handleRemoveFromCart}
                        icon="Trash"
                        classes={{
                            text: classes.sectionText
                        }}
                    />
                </Kebab>
            </div>
        </li>
    );
};

export default QuoteProduct;
