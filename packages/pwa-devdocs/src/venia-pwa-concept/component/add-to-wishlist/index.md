---
title: Add to wishlist component
---

| Description                              | Reference image                      |
| ---------------------------------------- | :----------------------------------: |
| Initial **Add to Wishlist** button state | ![Add to wishlist]{:width="300px"}   |
| Item added to wishlist                   | ![Added to wishlist]{:width="300px"} |
{:style="table-layout:auto"}

[Add to wishlist]: {{ site.baseurl }}{% link venia-pwa-concept/images/add-to-wishlist.png %}
[Added to wishlist]: {{ site.baseurl }}{%link venia-pwa-concept/images/added-to-wishlist.png%}

## Interactions

* **Item added indicator** - On tap, the heart icon grows slightly as it fills with color before returning to its original size.
* **Item removed indicator** - On tap, the heart icon shrinks slightly as the fill color disappears before returning to its original size.
* **Add to wishlist prompt when out of stock** - A message bar that asks if the user would like to add the product to the wishlist.
  This message appears for currently unavailable products when the user selects that specific product configuration(i.e. size, color, etc.) or lands on the Product page from a search.
* **Add wishlist items to cart** - A message bar on the checkout screen/full shopping cart view that asks if the user would like to add wishlist items to the cart before checking out.
  User can opt to disable this notification on subsequent visits.
