import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Price } from '@magento/peregrine';
import MessageSquareIcon from 'react-feather/dist/icons/message-square';
import ShoppingCartIcon from 'react-feather/dist/icons/shopping-cart';
import Share2Icon from 'react-feather/dist/icons/share-2';

import classify from 'src/classify';
import ButtonGroup from 'src/components/ButtonGroup';
import Icon from 'src/components/Icon';
import { itemPropType } from './constants';
import defaultClasses from './orderItem.css';

class OrderItem extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            main: PropTypes.string,
            imageAndPropsContainer: PropTypes.string,
            titleImage: PropTypes.string,
            propsColumnContainer: PropTypes.string,
            title: PropTypes.string,
            priceContainer: PropTypes.string
        }),
        currencyCode: PropTypes.string,
        item: itemPropType
    };

    //TODO: get currencyCode whether from item object or from order or from user cart
    static defaultProps = {
        item: {},
        currencyCode: 'USD'
    };

    get buyContent() {
        return (
            <Fragment>
                <Icon src={ShoppingCartIcon} size={12} />
                <span>Buy</span>
            </Fragment>
        );
    }

    get reviewContent() {
        return (
            <Fragment>
                <Icon src={MessageSquareIcon} size={12} />
                <span>Review</span>
            </Fragment>
        );
    }

    get shareContent() {
        return (
            <Fragment>
                <Icon src={Share2Icon} size={12} />
                <span>Share</span>
            </Fragment>
        );
    }

    render() {
        const {
            buyContent,
            buyItem,
            props,
            reviewContent,
            reviewItem,
            shareContent,
            shareItem
        } = this;
        const { classes, currencyCode, item } = props;
        const { color, name, price, qty, size, titleImageSrc } = item;

        const buttonGroupItems = [
            {
                key: 'buy',
                onClick: buyItem,
                children: buyContent
            },
            {
                key: 'share',
                onClick: shareItem,
                children: shareContent
            },
            {
                key: 'review',
                onClick: reviewItem,
                children: reviewContent
            }
        ];

        return (
            <div className={classes.root}>
                <div className={classes.main}>
                    <div className={classes.imageCell}>
                        <img
                            className={classes.titleImage}
                            src={titleImageSrc}
                            alt="itemOfClothes"
                        />
                    </div>
                    <dl className={classes.propsList}>
                        <dt className={classes.propLabel}>Name</dt>
                        <dd className={classes.propValue}>{name}</dd>
                        <dt className={classes.propLabel}>Size</dt>
                        <dd className={classes.propValue}>{size}</dd>
                        <dt className={classes.propLabel}>Color</dt>
                        <dd className={classes.propValue}>{color}</dd>
                        <dt className={classes.propLabel}>Quantity</dt>
                        <dd className={classes.propValue}>{qty}</dd>
                    </dl>
                    <div className={classes.priceContainer}>
                        <Price value={price || 0} currencyCode={currencyCode} />
                    </div>
                </div>
                <ButtonGroup items={buttonGroupItems} />
            </div>
        );
    }
}

export default classify(defaultClasses)(OrderItem);
