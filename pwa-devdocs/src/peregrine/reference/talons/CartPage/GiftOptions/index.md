---
title: Gift Options Talons
adobeio: /api/peregrine/talons/CartPage/GiftOptions/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions.md %}

## Examples

### useGiftOptions()

```jsx
import React from 'react'

import useGiftOptions from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions';
import MyGiftOptionsOperations from './myGiftOptions.gql';

const MyGiftOptions = props => {

    const { mutations, queries } = MyGiftOptionsOperations;

    const {
        includeGiftReceipt,
        includePrintedCard,
        giftMessage,
        toggleIncludeGiftReceiptFlag,
        toggleIncludePrintedCardFlag,
        updateGiftMessage
    } = useGiftOptions({ mutations, queries });

    return (
        // JSX that renders a Gift Options component using talon props
    )
}

export default MyGiftOptions
```
