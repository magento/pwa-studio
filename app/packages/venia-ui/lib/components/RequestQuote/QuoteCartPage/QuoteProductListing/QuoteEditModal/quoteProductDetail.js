import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './quoteProductDetail.module.css';
import productImage from './vt12-kh_main.jpg';
const IMAGE_SIZE = 240;

const QuoteProductDetail = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Image
                classes={{
                    image: classes.image,
                    root: classes.imageContainer
                }}
                alt={'Main'}
                width={IMAGE_SIZE}
                src={productImage}
            />
            <span className={classes.productName}>
                <FormattedMessage id={'quoteProductDetail.productName'} defaultMessage={'Jillian Top'} />
            </span>
            <div className={classes.stockRow}>
                <span>
                    <FormattedMessage id={'quoteProductDetail.skuNumber'} defaultMessage={'SKU # JTOP1'} />
                </span>
                <span>
                    {' '}
                    <FormattedMessage id={'quoteProductDetail.productName'} defaultMessage={'In stock'} />
                </span>
            </div>
            <div className={classes.price}>$58.00</div>
        </div>
    );
};

export default QuoteProductDetail;
