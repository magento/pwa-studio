---
title: Simple REST checkout flow
---

{:.bs-callout .bs-callout-warning}
This topic is subject to change as the progress of Magento 2.3 GraphQL coverage continues to expand.

The checkout process is an important piece of any online store.
It can be as simple as a single click or as complicated as filling out a series of forms to complete a purchase.

The goal of this topic is to describe a simple, end-to-end checkout implementation in Venia to learn from and build upon in your own projects.

## Magento REST endpoints

GraphQL is a significant improvement over REST when working with asynchronous data requests.
In its current state, Magento 2.3 GraphQL coverage only includes a limited subset of catalog operations, so
the checkout flow described in this topic uses the REST API to complete the process.

The following is a list of Magento REST endpoints and HTTP methods used for this checkout flow:

| REST Endpoint                     | HTTP method | Usage                                                   |
| --------------------------------- | ----------- | ------------------------------------------------------- |
| `/V1/guest-carts`                 | POST        | Get information about or create and store a new cart ID |
| `/V1/guest-carts/{cartId}/items`  | POST        | Update cart with item details                           |
| `/V1/guest-carts/{cartId}`        | GET         | Get information about the cart items                    |
| `/V1/guest-carts/{cartId}/totals` | GET         | Get information about cart totals                       |
{:style="table-layout:auto"}

For a list of Magento REST endpoints, see the [REST API documentation][] in devdocs.

## Shopper experience

Before going into the technical steps that happens in the background, you should be familiar with the events surrounding the checkout process.

The following steps summarize the basic checkout experience for an online shopper in `Venia`:

1. The shopper navigates to a product page.
1. The shopper adds an item to the cart using the **Add to Cart** button.
1. The shopping cart drawer slides out as a response to the add item action.
1. The shopper clicks on the **Checkout** button.
1. The **Shipping and Billing** form appears and replaces the shopping cart drawer.
1. The shopper fills out the form or uses preset account information and clicks on the **Submit Order** button.
1. A confirmation page appears and the shopper clicks on **Continue Shopping** to go back to the product page.

## Detailed technical flow

The following sections provide the technical details for each step in the checkout flow.

### Updating the cart

1. When the shopper clicks on the **Add To Cart** button, the [Product component][] calls the `addItemToCart` [action creator][] and waits for the action resolution.
2. The `addItemToCart` function checks the local storage for an existing cart ID.

    If an existing cart ID does not exist, the function dispatches a `CREATE_GUEST_CART` action, using data from a POST request to the `/V1/guest-carts` REST endpoint, to assign a cart ID to the current session.

    After the function obtains an existing cart ID, it dispatches an `ADD_ITEM_TO_CART` action, using data from a POST request to `V1/guest-carts/<cartID>/items`, to update the cart.
    This request also updates the cart information stored on the server.
3. When the `ADD_ITEM_TO_CART` returns with a successful response, the function calls `getCartDetails` and `toggleCart`.

    The `getCartDetails` action creator makes two simultaneous calls to the `/V1/guest-carts/<cartId>` and `/V1/guest-carts/<cartId>/totals` REST endpoints.
    When the parallel requests return with successful responses, it combines the data to create a payload for the `GET_CART_DETAILS` action.
    This action updates the information displayed on the cart with the new data.

    The `toggleCart` action creator dispatches the `TOGGLE_DRAWER` action to open the cart for viewing.

### Checking out

1. When the shopper clicks on the **Checkout** button, the `requestOrder` action creator dispatches the `REQUEST_ORDER` action.
2. After the action completes, the function dispatches the `RECEIVE_ORDER` action.

### Submitting the order

1. When the shopper clicks on the **Submit Order** button, the `submitOrder` action creator dispatches the `SUBMIT_ORDER` action.
2. After the action completes, the function dispatches the `ACCEPT_ORDER` action.

### Completing the checkout flow

The checkout flow ends with the shopper clicking on the **Continue Shopping** button.
This calls the `resetCheckout` action creator which calls `closeDrawer` to hide the cart drawer and dispatches the `RESET_CHECKOUT` action.
The `RESET_CHECKOUT` action returns the cart to its default empty state.

[REST API documentation]: https://devdocs.magento.com/swagger/index_23.html
[Product component]: {{site.data.vars.repo}}/tree/master/packages/venia-concept/src/RootComponents/Product/Product.js
[cart module]: {{site.data.vars.repot}}/tree/master/packages/venia-concept/src/actions/cart.js
[action creator]: https://redux.js.org/basics/actions#action-creators