---
title: Add to cart component
---

| Description           | Reference image                    |
| --------------------- | :--------------------------------: |
| Initial button state  | ![Add to cart (1)]{:width="300px"} |
| Loading indicator     | ![Add to cart (2)]{:width="300px"} |
| Product added to cart | ![Add to cart (3)]{:width="300px"} |
{:style="table-layout:auto"}

## Interactions:

* **Add item** - Button switches to an outline state with a load indicator while the item is being added.
  When the item is added, an animated checkmark replaces the load indicator and the button is re-filled with the initial color.

  The interaction completes with the appearance of a notification/indicator on the header shopping cart icon with the number of items added.
* **Remove item** - An item is removed by deleting it from the mini/shopping cart.
* **Add another item with different configuration** - When the user changes an item parameter, such as size,color, or quantity, the button changes from the checkmark state to the "Add to Cart" original state.

[Add to cart (1)]: {{ site.baseurl }}{% link venia-pwa-concept/images/atc-purchase-bar1.png %}
[Add to cart (2)]: {{ site.baseurl }}{% link venia-pwa-concept/images/atc-purchase-bar2.png %}
[Add to cart (3)]: {{ site.baseurl }}{% link venia-pwa-concept/images/atc-purchase-bar3.png %}

