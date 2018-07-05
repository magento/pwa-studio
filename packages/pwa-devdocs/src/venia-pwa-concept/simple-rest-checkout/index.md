---
title: Simple REST checkout flow
---

The checkout process is an important piece of any online store.

## User experience

* Navigate to a product page
* Add item to cart -> shopping cart slides out
* Click on Checkout button
* Add Shipping and Billing info
* Click on Submit Order button
* See confirmation page
* Click on Continue Shopping button

## Endpoints

* POST /V1/guest-carts
* POST /V1/guest-carts/{cartId}/items
* GET /V1/guest-carts/{cartId}
* GET /V1/guest-carts/{cartId}/totals

## Sequence of actions

* TOGGLE_DRAWER
* REQUEST_ORDER ->
* RECEIVE_ORDER <-
* SUBMIT_ORDER ->
* ACCEPT_ORDER <-
* TOGGLE_DRAWER
* RESET_CHECKOUT


{% comment %}
Topic should cover the following:

[ ] What is the general flow
[ ] REST vs GraphQL
[ ] Important API endpoints
[ ] Checkout steps with relevant code samples/examples 

{% endcomment %}