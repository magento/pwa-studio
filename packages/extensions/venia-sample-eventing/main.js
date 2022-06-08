import { useEffect } from 'react';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

const formatCartProducts = items => {
    const productList = [];
    items.forEach(item => {
        productList.push({
            SKU: item.product?.sku || null,
            name: item.product?.name || null,
            priceTotal: item.prices?.row_total?.value || null,
            quantity: item?.quantity || null,
            discountAmount: item.prices?.total_item_discount?.value || null,
            currencyCode: item.prices?.price?.currency || null,
            selectedOptions: item?.configurable_options
                ? item.configurable_options.reduce((result, item) => {
                      const option = {
                          attribute: item?.option_label || null,
                          value: item?.value_label || null
                      };
                      return [...result, option];
                  }, [])
                : null
        });
    });
    return productList;
};

export default original => props => {
    const [observable, { dispatch }] = useEventingContext();

    useEffect(() => {
        const sub = observable.subscribe(async event => {
            switch (event.type) {
                case 'CART_PAGE_VIEW':
                    console.log('Logging event:', {
                        type: event.type,
                        ...event.payload,
                        products: formatCartProducts(event.payload.products)
                    });
                    break;
                case 'CHECKOUT_PAGE_VIEW':
                    console.log('Logging event:', {
                        type: event.type,
                        ...event.payload,
                        products: formatCartProducts(event.payload.products)
                    });
                    break;
                case 'ORDER_CONFIRMATION_PAGE_VIEW':
                    console.log('Logging event:', {
                        type: event.type,
                        ...event.payload,
                        products: formatCartProducts(event.payload.products)
                    });
                    break;
                default:
                    console.log('Logging event:', event);
                    break;
            }
        });

        dispatch('hello world');

        return () => {
            sub.unsubscribe();
        };
    }, [dispatch, observable]);

    return original(props);
};
