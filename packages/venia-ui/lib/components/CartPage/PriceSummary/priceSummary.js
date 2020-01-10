import React from 'react';
import gql from 'fraql';
import { Price } from '@magento/peregrine';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import Button from '../../Button';
import { mergeClasses } from '../../../classify';
import defaultClasses from './priceSummary.css';

import GiftCardSummary from './giftCardSummary';

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            items {
                quantity
            }
            shipping_addresses {
                selected_shipping_method {
                    amount {
                        currency
                        value
                    }
                }
            }
            prices {
                applied_taxes {
                    amount {
                        currency
                        value
                    }
                }
                discounts {
                    amount {
                        currency
                        value
                    }
                }
                grand_total {
                    currency
                    value
                }
                subtotal_excluding_tax {
                    currency
                    value
                }
            }
            ${GiftCardSummary.fragments.appliedGiftCards}
        }
    }
`;
/**
 * A component that fetches and renders cart data including:
 *  - subtotal
 *  - coupons applied
 *  - gift cards applied
 *  - estimated tax
 *  - estimated shipping
 *  - estimated total
 */
const PriceSummary = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = usePriceSummary({
        query: GET_PRICE_SUMMARY
    });

    const {
        handleProceedToCheckout,
        hasError,
        hasItems,
        normalizedData
    } = talonProps;

    if (hasError) {
        return (
            <div className={classes.root}>
                An error occurred. Please refresh the page.
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    const {
        subtotal,
        discount,
        giftCard,
        tax,
        shipping,
        total
    } = normalizedData;

    return (
        <div className={classes.root}>
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>{'Subtotal'}</span>
                <span className={classes.price}>
                    <Price
                        value={subtotal.value}
                        currencyCode={subtotal.currency}
                    />
                </span>
                {discount.value ? (
                    <>
                        <span className={classes.lineItemLabel}>
                            {'Discount'}
                        </span>
                        <span className={classes.price}>
                            {'(-'}
                            <Price
                                value={discount.value}
                                currencyCode={discount.currency}
                            />
                            {')'}
                        </span>
                    </>
                ) : null}
                <GiftCardSummary classes={classes} data={giftCard} />
                <span className={classes.lineItemLabel}>{'Estimated Tax'}</span>
                <span className={classes.price}>
                    <Price value={tax.value} currencyCode={tax.currency} />
                </span>
                <span className={classes.lineItemLabel}>
                    {'Estimated Shipping'}
                </span>
                <span className={classes.price}>
                    {shipping.value ? (
                        <Price
                            value={shipping.value}
                            currencyCode={shipping.currency}
                        />
                    ) : (
                        <span>{'FREE'}</span>
                    )}
                </span>
                <span className={classes.totalLabel}>{'Estimated Total'}</span>
                <span className={classes.totalPrice}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </div>
            <div className={classes.checkoutButton_container}>
                <Button priority={'high'} onClick={handleProceedToCheckout}>
                    {'PROCEED TO CHECKOUT'}
                </Button>
            </div>
        </div>
    );
};

export default PriceSummary;
