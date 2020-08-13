---
title: Price Adjustments Talons
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/talons/CartPage/PriceAdjustments/useCouponCode.md %}

## Examples

### useCouponCode()

```jsx
import React from 'react'

import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/useCouponCode';

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
