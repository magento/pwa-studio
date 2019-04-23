---
title: Checkout
---

{:.bs-callout .bs-callout-warning}
This topic is subject to change as the progress of Magento 2.3 GraphQL coverage continues to expand.

The checkout process is an important piece of any online store.
It can be as simple as a single click or as complicated as filling out a series of forms to complete a purchase.

The goal of this topic is to describe the end-to-end checkout implementation in Venia to learn from and build upon in your own projects.

## A note about using Magento REST endpoints

GraphQL is a significant improvement over REST when working with asynchronous data requests.
In its current state, Magento 2.3 GraphQL coverage only includes a limited subset of catalog operations, so
the checkout flow described in this topic uses the REST API to complete the process.

For a list of Magento REST endpoints, see the [REST API documentation][] in devdocs.

## Shopper experience

Familiarize yourself with the user experience surrounding the checkout process to provide context for the technical steps that happen in the background.

The following steps summarize the basic checkout experience for a Venia shopper:

1. The shopper navigates to a product page.
1. The shopper adds an item to the cart using the **Add to Cart** button.
1. The shopping cart drawer slides in response and shows the product in the shopping cart.
1. The shopper clicks on the **Checkout** button.
1. The **Shipping and Billing** summary page appears with the following items:

    - **Ship To** - Click to display a form for setting the shipping address.
    - **Pay With** - Click to display a form that allows the shopper to select the payment method and billing address.
    - **Get It By** - Click to display a form that allows the shopper to select the shipping method.
    - **TOTAL** - Shows the shopping cart total.

1. The shopper fills out the forms and clicks on the **Place Order** button.
1. A confirmation page appears with buttons that lets the shopper **Continue Shopping** or **Create an Account**.

## Detailed technical flow

The following sections provide the technical details for each step in the checkout flow.

### Updating the cart

1. When the shopper clicks on the **Add To Cart** button, the application passes the shopper-specified product configuration to the `addItemToCart()` function.
2. Before the `addItemToCart()` function can add the product to the cart, it first checks the local storage for an existing cart ID.

    If an existing cart ID does not exist, it calls the `createGuestCart()` function.
    This function creates a POST request to the `/V1/guest-carts` REST endpoint to get a cart ID to store in the local storage.

    After a cart ID is found, the `addItemToCart` function uses the product information passed in by the application to update the cart.
    The cart is updated on the server side using a POST request to the `V1/guest-carts/<cartID>/items` REST endpoint.

3. After the server update completes, the function dispatches `toggleDrawer()` and `getCartDetails()`.

    The `toggleDrawer()` function is a general app action that toggles a named drawer.
    In this case, the 'cart' drawer is toggled to appear after adding an item.

    The `getCartDetails()` function retrieves cart data from the local cache or server to update the items displayed in the shopping cart drawer.
    This functions uses `fetchCartPart()` to call the `V1/guest-carts/<cartId>` and `V1/guest-carts/<cartId>/totals` REST endpoints to fetch and cache the cart details stored on the server.

| REST Endpoint                     | Usage                                                                 |
| --------------------------------- | --------------------------------------------------------------------- |
| [`guest-carts`][]                 | Get information about or create and store a new cart ID on the server |
| [`guest-carts/<cartId>/items`][]  | Update cart with item details                                         |
| [`guest-carts/<cartId>`][]        | Get information about the cart items                                  |
| [`guest-carts/<cartId>/totals`][] | Get information about cart totals                                     |
{:style="table-layout:auto"}

| Filename                             | Importance                                                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [src/actions/cart/asyncActions.js][] | Contains asynchronous functions for cart-related actions such as `addItemToCart()` and `createGuestCart()`. |
| [src/actions/app/asyncActions.js][]  | Contains the `toggleDrawer()` function                                                                      |

### Gathering payment and shipping information

When the shopper clicks on the **Checkout** button, the `beginCheckout()` function executes and dispatches the following actions:

1. `actions.begin()` - Updates the application's `step` state to display the _Form_ component in the shopping cart drawer.
   This component contains clickable _Section_ components that contain an overview of the shipping address, payment method, and shipping method forms.
1. `getShippingMethods()` - Creates a POST request to `guest-carts/<cartId>/estimate-shipping-methods` to get a list of available shipping methods based on a given address.
   If an address has not been provided, the ability to choose a shipping method is disabled.
1. `getCountries()` - Creates a GET request to the `directory/countries` REST endpoint to get a list of countries and regions from the backing store.
   The `submitShippingAddress()` and `submitBillingAddress()` functions use this list to validate the country for a given address.

#### Braintree integration

Venia comes with Braintree integration built into the checkout process.
This gives Venia the ability to simulate payment submission using a real payments platform.

See [Braintree integration][] for more information.

#### Form sections

Clicking on a _Section_ component dispatches actions that update the _Form_ component to show an editable form for shipping address, payment method, or shipping method.

Each form has a **Save** and **Cancel** button.

Clicking on the **Cancel** button on each form dispatches an action that returns the _Form_ component to its order overview state.

On the shipping address form, the **Save** button calls the `submitShippingAddress()` function.
This function validates the address data before saving locally.

On the payment method form, the **Save** button calls the `submitPaymentMethodAndBillingAddress()` function.
This function saves the selected payment method and billing address locally.

On the shipping method form, the **Save** button calls the `submitShippingMethod()` function.
This function saves the selected shipping method locally.
It also creates a POST request to the `guest-carts/<cartId>/shipping-information` REST endpoint to update the shipping method information on the server.

After a form is saved, each of the submit functions dispatches an action that returns the _Form_ component to its order overview state.

| REST Endpoint                                        | Usage                                                |
| ---------------------------------------------------- | ---------------------------------------------------- |
| [`guest-carts/<cartId>/estimate-shipping-methods`][] | Get a list of available shipping methods             |
| [`directory/countries`][]                            | Get a list of countries and regions                  |
| [`guest-carts/<cartId>/shipping-information`][]      | Updates the shipping method information on the order |
{:style="table-layout:auto"}

| Filename                                  | Importance                                                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [src/actions/checkout/asyncActions.js][]  | Contains asynchronous functions for checkout-related actions such as `beginCheckout()` and the order form submit methods. |
| [src/reducers/checkout.js][]              | Reducer functions for checkout-related actions.                                                                            |
| [src/actions/cart/asyncActions.js][]      | Contains the definition for the `getShippingMethods()` function.                                                           |
| [src/actions/directory/asyncActions.js][] | Contains the definition for the `getCountries()` function.                                                                 |
| [src/components/Checkout/flow.js][]       | _Flow_ component that determines the content of the shopping cart drawer.                                                  |
| [src/components/Checkout/form.js][]       | _Form_ component which shows the checkout forms or a summary of the checkout information provided by the shopper           |

### Submitting the order

After all the order information forms are filled out and save, the **Place Order** button becomes active.
Clicking on this button executes the `submitOrder()` function:

1. The `submitOrder()` function retrieves the provided order information from local storage and sends that information in a POST request to the `guest-carts/<cartId>/payment-information` REST endpoint.
   The rest of the order processing flow is completed on the server.

1. On a successful request, the server responds with an order ID.
   The application saves this value in the local storage for use in the `receipt` phase of the checkout flow.

1. Next, the application clears everything about the shopping cart in the local storage.
   This includes the following:

    - Cart ID
    - Address information
    - Payment type information
    - Shipping method information

1. The last thing the `submitOrder()` function does is dispatch an action that updates the applications `step` state to show the _Receipt_ component.

| REST Endpoint                                  | Usage                                                                |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| [`guest-carts/<cartId>/payment-information`][] | Set the payment information and places the order for a specific cart |
{:style="table-layout:auto"}

| Filename                                 | Importance                                              |
| ---------------------------------------- | ------------------------------------------------------- |
| [src/actions/checkout/asyncActions.js][] | Contains the `submitOrder()` asynchronous function      |
| [src/components/Checkout/form.js][]      | _Form_ component which displays the submit order button |

### Completing the checkout flow

The final screen in the shopping cart flow is the receipt screen.
This screen shows the recently stored order ID number and buttons to **Continue Shopping** or **Create an Account**.

| Filename                                       | Importance                                                  |
| ---------------------------------------------- | ----------------------------------------------------------- |
| [src/components/Checkout/Receipt/receipt.js][] | _Receipt_ component which displays the order submit summary |

[product component]: {{site.data.vars.repo}}/tree/master/packages/venia-concept/src/RootComponents/Product/Product.js
[cart module]: {{site.data.vars.repot}}/tree/master/packages/venia-concept/src/actions/cart.js
[Braintree integration]: {{site.baseurl}}{%link venia-pwa-concept/features/braintree/index.md %}

[rest api documentation]: https://devdocs.magento.com/redoc/2.3/
[action creator]: https://redux.js.org/basics/actions#action-creators
[`guest-carts`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#tag/guest-carts
[`guest-carts/<cartid>/items`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#operation/quoteGuestCartItemRepositoryV1GetListGet
[`guest-carts/<cartid>`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#tag/guest-cartscartId
[`guest-carts/<cartid>/totals`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#tag/guest-cartscartIdtotals
[`guest-carts/<cartid>/estimate-shipping-methods`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#tag/guest-cartscartIdestimate-shipping-methods
[src/actions/cart/asyncactions.js]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/actions/cart/asyncActions.js
[src/actions/app/asyncactions.js]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/actions/app/asyncActions.js
[src/actions/checkout/asyncactions.js]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/actions/checkout/asyncActions.js
[src/components/checkout/flow.js]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/components/Checkout/flow.js
[src/actions/directory/asyncactions.js]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/actions/directory/asyncActions.js
[`guest-carts/<cartid>/estimate-shipping-methods`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#tag/guest-cartscartIdestimate-shipping-methods
[`directory/countries`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#tag/directorycountries
[src/components/checkout/form.js]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/components/Checkout/form.js
[`guest-carts/<cartid>/shipping-information`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#tag/guest-cartscartIdshipping-information
[src/reducers/checkout.js]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/reducers/checkout.js
[`guest-carts/<cartid>/payment-information`]: https://devdocs.magento.com/redoc/2.3/guest-rest-api.html#tag/guest-cartscartIdpayment-information
[src/components/checkout/receipt/receipt.js]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/components/Checkout/Receipt/receipt.js
