---
title: Braintree integration
---

[Braintree][] is a payments platform for e-commerce companies.
It allows websites to accept credit card payments online and within mobile applications.

## Checkout integration

Braintree integration is accomplished using the [Braintree Drop-in][].

| Filename                 | Importance                                                              |
| ------------------------ | ----------------------------------------------------------------------- |
| [`braintreeDropin.js`][] | Hooks the Web Payments and Payment Request API to the Braintree Drop-in |
{:style="table-layout:auto"}

See the [Braintree Drop-in docs][] for more information.

## Testing the feature

This feature is part of the [checkout process][].
When asked for payment information, a credit card prompt appears.

Use the following mock data to pass validation and ensure a successful checkout.

| Field           | Value                                           |
| --------------- | ----------------------------------------------- |
| Cardholder Name | Any                                             |
| Card Number     | `4111 1111 1111 1111` or any from [this list][] |
| Expiration Date | Any future date                                 |
| CVV             | Any number                                      |
{:style="table-layout:auto"}

[braintree]: https://www.braintreepayments.com/
[`braintreedropin.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/components/Checkout/braintreeDropin.js
[this list]: https://developers.braintreepayments.com/guides/credit-cards/testing-go-live/node#valid-card-numbers
[Braintree Drop-in]: https://github.com/braintree/braintree-web-drop-in
[Braintree Drop-in docs]: https://braintree.github.io/braintree-web-drop-in/docs/current/index.html

[checkout process]: {{site.baseurl}}{%link venia-pwa-concept/features/checkout/index.md %}
