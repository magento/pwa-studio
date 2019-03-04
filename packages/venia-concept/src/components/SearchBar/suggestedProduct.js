import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import { Link, resourceUrl } from 'src/drivers';

import defaultClasses from './suggestedProduct.css';

const productUrlSuffix = '.html';

class suggestedProduct extends Component {
    static propTypes = {
        handleOnProductOpen: PropTypes.func.isRequired,
        url_key: PropTypes.string.isRequired,
        small_image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.object.isRequired,
        classes: PropTypes.shape({
            root: PropTypes.string,
            productName: PropTypes.string,
            productImage: PropTypes.string
        })
    };

    render() {
        const {
            handleOnProductOpen,
            classes,
            url_key,
            small_image,
            name,
            price
        } = this.props;

        const productLink = resourceUrl(`/${url_key}${productUrlSuffix}`);

        return (
            <li className={classes.root}>
                <Link onClick={handleOnProductOpen} to={productLink}>
                    <img
                        className={classes.productImage}
                        alt={name}
                        src={resourceUrl(small_image, {
                            type: 'image-product',
                            width: 60
                        })}
                    />
                </Link>
                <Link
                    onClick={handleOnProductOpen}
                    className={classes.productName}
                    to={productLink}
                    dangerouslySetInnerHTML={{ __html: name }}
                />
                <Link onClick={handleOnProductOpen} to={productLink}>
                    <Price
                        currencyCode={price.regularPrice.amount.currency}
                        value={price.regularPrice.amount.value}
                    />
                </Link>
            </li>
        );
    }
}

export default classify(defaultClasses)(suggestedProduct);
