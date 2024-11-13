import { useEffect, useRef } from 'react';
import {
  CART_CONTENTS_KEY,
  PURCHASE_HISTORY_KEY,
  USER_VIEW_HISTORY_KEY,
  USER_VIEW_HISTORY_TIME_DECAY_KEY,
} from '../constants';
import makeUrl from '@magento/venia-ui/lib/util/makeUrl';
import useShoppingCartQuery from '@magento/venia-data-collector/lib/hooks/useShoppingCartQuery';
import { mse } from '@magento/venia-data-collector';

export default () => {
  const firstLoad = useRef(true);
  const { data } = useShoppingCartQuery({
    fetchPolicy: 'cache-first',
    skip: !firstLoad.current,
  });

  const cartEventHandler = () => {
    const shoppingCartContext = mse.context.getShoppingCart();
    const dsCart = transformData(shoppingCartContext);
    localStorage.setItem(CART_CONTENTS_KEY, JSON.stringify(dsCart));
  };

  const handleProductPageView = () => {
    const product = mse.context.getProduct();

    if (product && product.sku) {
      const productPageViewContext = {
        date: new Date().toISOString(),
        sku: product.sku,
      };
      // if sku is not in viewHistorySkus
      // write to view_history_decay
      try {
        let viewHistory = JSON.parse(
          localStorage.getItem(USER_VIEW_HISTORY_TIME_DECAY_KEY),
        );

        if (!viewHistory) {
          const updatedViewHistory = [productPageViewContext];
          localStorage.setItem(
            USER_VIEW_HISTORY_TIME_DECAY_KEY,
            JSON.stringify(updatedViewHistory),
          );
        } else {
          const productIndex = viewHistory.findIndex(
            viewedProduct => viewedProduct.sku === product.sku,
          );
          if (productIndex === -1) {
            const updatedViewHistory = [...viewHistory, productPageViewContext];
            localStorage.setItem(
              USER_VIEW_HISTORY_TIME_DECAY_KEY,
              JSON.stringify(updatedViewHistory),
            );
            // has been viewed before
          } else if (productIndex >= 0) {
            // remove current value in viewHistory,
            // and add the new value
            viewHistory.splice(productIndex, 1, productPageViewContext);
            localStorage.setItem(
              USER_VIEW_HISTORY_TIME_DECAY_KEY,
              JSON.stringify(viewHistory),
            );
          }
        }
      } catch (e) {
        console.error(e);
      }

      //write to view_history
      try {
        let viewHistory = JSON.parse(
          localStorage.getItem(USER_VIEW_HISTORY_KEY),
        );

        if (!viewHistory) {
          const updatedViewHistory = { skus: [product.sku] };
          localStorage.setItem(
            USER_VIEW_HISTORY_KEY,
            JSON.stringify(updatedViewHistory),
          );
        } else {
          const productIndex = viewHistory.skus.findIndex(
            viewedProduct => viewedProduct === product.sku,
          );
          if (productIndex === -1) {
            const updatedViewHistory = {
              skus: [...viewHistory.skus, product.sku],
            };
            localStorage.setItem(
              USER_VIEW_HISTORY_KEY,
              JSON.stringify(updatedViewHistory),
            );
            // has been viewed before
          } else if (productIndex >= 0) {
            // remove current value in viewHistory,
            // and add the new value
            viewHistory.skus.splice(productIndex, 1, product.sku);
            localStorage.setItem(
              USER_VIEW_HISTORY_KEY,
              JSON.stringify(viewHistory),
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePlaceOrder = event => {
    if (
      event.eventInfo &&
      event.eventInfo.shoppingCartContext &&
      event.eventInfo.shoppingCartContext.items
    ) {
      let { items } = event.eventInfo.shoppingCartContext;
      items = items.map(item => {
        return item.product.sku;
      });
      const additionalPurchaseHistory = {
        date: new Date().toISOString(),
        items,
      };
      try {
        const currentPurchaseHistory = JSON.parse(
          localStorage.getItem(PURCHASE_HISTORY_KEY),
        );
        const newPurchaseHistory = [
          ...(currentPurchaseHistory ? currentPurchaseHistory : []),
          additionalPurchaseHistory,
        ];
        localStorage.setItem(
          PURCHASE_HISTORY_KEY,
          JSON.stringify(newPurchaseHistory),
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    mse.subscribe.removeFromCart(cartEventHandler);
    mse.subscribe.addToCart(cartEventHandler);
    mse.subscribe.productPageView(handleProductPageView);
    mse.subscribe.placeOrder(handlePlaceOrder);

    return () => {
      mse.unsubscribe.removeFromCart(cartEventHandler);
      mse.unsubscribe.addToCart(cartEventHandler);
      mse.unsubscribe.productPageView(handleProductPageView);
      mse.unsubscribe.placeOrder(handlePlaceOrder);
    };
  }, []);

  useEffect(() => {
    if (data && firstLoad.current) {
      firstLoad.current = false;
      const firstLoadCart = transformData(data.cart, 'firstLoad');
      localStorage.setItem(CART_CONTENTS_KEY, JSON.stringify(firstLoadCart));
    }
  }, [data, firstLoad]);
};

const productTypesMap = new Map([
  ['SimpleProduct', 'simple'],
  ['ConfigurableProduct', 'configurable'],
]);

const transformData = shoppingCart => {
  let dsCart;
  if (shoppingCart && shoppingCart.items && shoppingCart.items.length > 0) {
    dsCart = {
      cart: {
        items: shoppingCart.items.map(item => {
          const { product, prices } = item;
          return {
            product_type: productTypesMap.get(product.__typename),
            item_id: item.id,
            qty: item.quantity,
            product_id: product.id,
            product_name: product.name,
            product_sku: product.sku,
            product_url: makeUrl(
              `${window.location.origin}/${product.url_key}${
                product.url_suffix
              }`,
            ),
            product_price_value: prices.price.value,
            product_image: {
              src: product.thumbnail.url,
              alt: product.thumbnail.label || '',
            },
          };
        }),
      },
    };
  } else {
    dsCart = {
      cart: {
        items: [],
      },
    };
  }

  return dsCart;
};
