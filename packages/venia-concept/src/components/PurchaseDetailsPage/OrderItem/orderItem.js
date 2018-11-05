import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Price } from '@magento/peregrine';
import classify from 'src/classify';
import defaultClasses from './orderItem.css';
import ButtonGroup from './ButtonGroup';
import { itemPropType } from './constants';
import { getButtonGroupItems } from './helpers';

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
        item: itemPropType,
        onBuyAgain: PropTypes.func,
        onShare: PropTypes.func,
        currencyCode: PropTypes.string
    };

    //TODO: get currencyCode whether from item object or from order or from user cart
    static defaultProps = {
        item: {},
        currencyCode: 'USD'
    };
    //TODO: make correct mapping from item
    onBuyAgainHandler = () => {
        this.props.onBuyAgain({ item: this.props.item, quantity: 1 });
    };
    //TODO: make correct mapping from item
    onShareHandler = () => {
        this.props.onShare(this.props.item);
    };

    render() {
        const {
            classes,
            item: { titleImageSrc, name, size, color, qty, price },
            currencyCode
        } = this.props;
        //TODO: implement reviewItem handler and use as argument in below function
        const buttonGroupItems = getButtonGroupItems(
            this.onBuyAgainHandler,
            this.onShareHandler
        );

        return (
            <div className={classes.root}>
                <div className={classes.main}>
                    <div className={classes.imageAndPropsContainer}>
                        <img
                            className={classes.titleImage}
                            src={titleImageSrc}
                            alt="itemOfClothes"
                        />
                        <div className={classes.propsColumnContainer}>
                            <div className={classes.name}>{name}</div>
                            <div>Size : {size}</div>
                            <div>Color : {color}</div>
                            <div>Qty : {qty}</div>
                        </div>
                    </div>
                    <div className={classes.priceContainer}>
                        <Price value={price || 0} currencyCode={currencyCode} />
                    </div>
                </div>
                <ButtonGroup buttonGroupItems={buttonGroupItems} />
            </div>
        );
    }
}

export default classify(defaultClasses)(OrderItem);
