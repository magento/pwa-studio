---
title: Price Adjustments Talons
adobeio: /api/peregrine/talons/CartPage/PriceAdjustments/
---

These talons provide logic for components that may adjust the total price in a shopping cart.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/useCouponCode.md %}

## Examples

### useCouponCode()

```jsx
import React from 'react'

import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/useCouponCode';

import {
    GET_APPLIED_COUPONS,
    APPLY_COUPON_MUTATION,
    REMOVE_COUPON_MUTATION
} from './myCouponCodeQueries'

const MyCouponCode = props => {

    const talonProps = useCouponCode({
        setIsCartUpdating: props.setIsCartUpdating,
        mutations: {
            applyCouponMutation: APPLY_COUPON_MUTATION,
            removeCouponMutation: REMOVE_COUPON_MUTATION
        },
        queries: {
            getAppliedCouponsQuery: GET_APPLIED_COUPONS
        }
    });

    const {
        applyingCoupon,
        data,
        errorMessage,
        fetchError,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    } = talonProps;

    if (!data) {
        return null;
    }

    if (fetchError) {
        return 'Something went wrong. Refresh and try again.';
    }

    return (
        // JSX for rendering a Coupon Code form and applied codes using props from the talon
    )
}

export default MyCouponCode
```

### Shipping Methods

```jsx
import React from 'react';
import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';
import { useShippingForm } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';
import { useShippingRadios } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingRadios';

import { GET_SHIPPING_METHODS, SET_SHIPPING_ADDRESS_MUTATION, SET_SHIPPING_METHOD_MUTATION } from './myShippingMethods.gql';

const MyShippingMethods = props => {
    const { setIsCartUpdating } = props;

    const shippingMethodsProps = useShippingMethods({
        queries: GET_SHIPPING_METHODS
    });

    const {
        hasMethods,
        isShowingForm,
        selectedShippingFields,
        selectedShippingMethod,
        shippingMethods,
        showForm
    } = shippingMethodsProps;

    const shippingFormProps = useShippingForm({
        selectedValues: selectedShippingFields,
        setIsCartUpdating,
        mutations: {
            setShippingAddressMutation: SET_SHIPPING_ADDRESS_MUTATION
        },
        queries: {
            shippingMethodsQuery: GET_SHIPPING_METHODS
        }
    });

    const {
        formErrors,
        handleOnSubmit,
        handleZipChange,
        isSetShippingLoading
    } = shippingFormProps;

    const shippingRadioProps = useShippingRadios({
        setIsCartUpdating,
        selectedShippingMethod,
        shippingMethods,
        mutations: {
            setShippingMethodMutation: SET_SHIPPING_METHOD_MUTATION
        }
    });

    const {
        formattedShippingMethods,
        handleShippingSelection
    } = shippingRadioProps;

    return (
        // JSX for rendering shipping methods form using props from the shipping methods talons
    )
}

export default MyShippingMethods
```
