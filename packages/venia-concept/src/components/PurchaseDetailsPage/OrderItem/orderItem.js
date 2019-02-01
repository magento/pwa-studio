import React, { Component, Fragment } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import MessageSquareIcon from 'react-feather/dist/icons/message-square';
import ShoppingCartIcon from 'react-feather/dist/icons/shopping-cart';
import Share2Icon from 'react-feather/dist/icons/share-2';

import classify from 'src/classify';
import ButtonGroup from 'src/components/ButtonGroup';
import Icon from 'src/components/Icon';
import defaultClasses from './orderItem.css';

const noop = () => {};

class OrderItem extends Component {
    static propTypes = {
        classes: shape({
            image: string,
            main: string,
            price: string,
            propLabel: string,
            propValue: string,
            propsList: string,
            root: string
        }),
        currencyCode: string,
        item: shape({
            color: string,
            id: number,
            name: string,
            price: number,
            qty: number,
            size: string,
            sku: string,
            titleImageSrc: string
        }),
        onBuyItem: func,
        onReviewItem: func,
        onShareItem: func
    };

    //TODO: get currencyCode whether from item object or from order or from user cart
    static defaultProps = {
        item: {},
        currencyCode: 'USD',
        onBuyItem: noop,
        onReviewItem: noop,
        onShareItem: noop
    };

    buyItem = () => {
        const { item, onBuyItem } = this.props;

        onBuyItem(item);
    };

    reviewItem = () => {
        const { item, onReviewItem } = this.props;

        onReviewItem(item);
    };

    shareItem = () => {
        const { item, onShareItem } = this.props;

        onShareItem(item);
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
                    <img
                        className={classes.image}
                        src={titleImageSrc}
                        alt="itemOfClothes"
                    />
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
                    <div className={classes.price}>
                        <Price value={price || 0} currencyCode={currencyCode} />
                    </div>
                </div>
                <ButtonGroup items={buttonGroupItems} />
            </div>
        );
    }
}

export default classify(defaultClasses)(OrderItem);
