import React from 'react';
import { storiesOf } from '@storybook/react';

import '../../../index.css';
import { Adapter } from '@magento/venia-drivers';
import store from '../../../store';

import MiniCart from '../miniCart';
import defaultClasses from '../miniCart.css';

const apiBase = new URL('/graphql', location.origin).toString();
const noop = () => {};

const nonConfigurableItem = {
    __typename: 'SimpleProduct',
    image: {
        __typename: 'MediaGalleryEntry',
        disabled: false,
        file: '/v/a/va11-sg_main.jpg',
        label: 'Main',
        position: 1
    },
    item_id: 1,
    name: 'A Non-Configurable Product',
    options: [],
    price: 49,
    product_type: 'simple',
    qty: 1,
    quote_id: '1234',
    sku: 'SKU'
};
const configurableItem = {
    ...nonConfigurableItem,
    __typename: 'ConfigurableProduct',
    image: {
        ...nonConfigurableItem.image,
        file: '/v/t/vt11-rn_main_1.jpg'
    },
    name: 'A Configurable Product',
    options: [
        { value: 'Rain', label: 'Fashion Color' },
        { value: 'M', label: 'Fashion Size' }
    ],
    product_type: 'configurable'
};

const baseProps = {
    beginEditItem: noop,
    cart: {
        details: {
            currency: {
                quote_currency_code: 'USD'
            },
            items: [],
            items_qty: 0
        },
        editItem: null,
        isEditingItem: false,
        isLoading: false,
        isUpdatingItem: false,
        totals: {
            subtotal: 49
        }
    },
    classes: defaultClasses,
    closeDrawer: noop,
    endEditItem: noop,
    isCartEmpty: true,
    isMiniCartMaskOpen: false,
    isOpen: true,
    removeItemFromCart: noop,
    updateItemInCart: noop
};

const stories = storiesOf('MiniCart', module);

stories.add('Loading', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isLoading: true
        }
    };

    return (
        <Adapter
            apiBase={apiBase}
            apollo={{ link: Adapter.apolloLink(apiBase) }}
            store={store}
        >
            <MiniCart {...props} />
        </Adapter>
    );
});

stories.add('Empty Cart', () => {
    const props = {
        ...baseProps
    };

    return (
        <Adapter
            apiBase={apiBase}
            apollo={{ link: Adapter.apolloLink(apiBase) }}
            store={store}
        >
            <MiniCart {...props} />
        </Adapter>
    );
});

stories.add('Many Items', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            details: {
                ...baseProps.cart.details,
                items: [
                    configurableItem,
                    // Give each of these a new item_id
                    // to avoid React duplicate key warnings.
                    { ...nonConfigurableItem, item_id: 2 },
                    { ...configurableItem, item_id: 3 },
                    { ...nonConfigurableItem, item_id: 4 },
                    { ...configurableItem, item_id: 5 },
                    { ...nonConfigurableItem, item_id: 6 },
                    { ...configurableItem, item_id: 7 }
                ],
                items_qty: 7
            }
        },
        isCartEmpty: false
    };

    return (
        <Adapter
            apiBase={apiBase}
            apollo={{ link: Adapter.apolloLink(apiBase) }}
            store={store}
        >
            <MiniCart {...props} />
        </Adapter>
    );
});

stories.add('Editing', () => {
    const props = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            editItem: nonConfigurableItem,
            isEditingItem: true,
            isLoading: false
        },
        isCartEmpty: false
    };

    return (
        <Adapter
            apiBase={apiBase}
            apollo={{ link: Adapter.apolloLink(apiBase) }}
            store={store}
        >
            <MiniCart {...props} />
        </Adapter>
    );
});
