---
title: Gift Cards Talons
adobeio: /api/peregrine/talons/CartPage/GiftCards/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/peregrine/lib/talons/CartPage/GiftCards/useGiftCards.md %}

## Examples

### useGiftCards()

```jsx
import React from 'react'
import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards'
import {
    GET_CART_GIFT_CARDS_QUERY,
    GET_GIFT_CARD_BALANCE_QUERY,
    APPLY_GIFT_CARD_MUTATION,
    REMOVE_GIFT_CARD_MUTATION
} from './myGiftCardQueries';

const MyGiftCards = props => {

 const talonProps = useGiftCards({
     setIsCartUpdating: props.setIsCartUpdating,
     mutations: {
         applyCardMutation: APPLY_GIFT_CARD_MUTATION,
         removeCardMutation: REMOVE_GIFT_CARD_MUTATION
     },
     queries: {
         appliedCardsQuery: GET_CART_GIFT_CARDS_QUERY,
         cardBalanceQuery: GET_GIFT_CARD_BALANCE_QUERY
     }
 });

 const propsFromTalon = useGiftCards(talonProps)

 const {
     applyGiftCard,
     checkBalanceData,
     checkGiftCardBalance,
     errorLoadingGiftCards,
     errorRemovingCard,
     giftCardsData,
     isLoadingGiftCards,
     isApplyingCard,
     isCheckingBalance,
     isRemovingCard,
     removeGiftCard,
     setFormApi,
     shouldDisplayCardBalance,
     shouldDisplayCardError
 } = propsFromTalon;

 return (
     // JSX using the props from the talon
 )
}

export default MyGiftCards
```

### useGiftCard()

```jsx
import React from 'react'
import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard';

const MyGiftCard = props => {
    const { code } = props;

    const removeGiftCard = code => {
        // Logic for removing a gift card using its code
        // This can also be passed in as a prop
    }

    const { removeGiftCardWithCode } = useGiftCard({
        code,
        removeGiftCard
    });

    return (
        // JSX for rendering a single Gift Card using data from the talon
    )
}

export default MyGiftCard
```
