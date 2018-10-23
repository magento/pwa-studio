---
title: Quantity selector component
---
| Description       | Reference image                      |
| ----------------- | :----------------------------------: |
| Quantity selector | ![Quantity selector]{:width="300px"} |
{:style="table-layout:auto"}

## Interactions

* **Unavailable indicator** - If the current product configuration is unavailable, the quantity selector field is disabled.
* **Selection** - If the user selects a quantity before they configure a product, a message appears indicating that they need to choose a configuration before selecting a quantity.
  
  This field can be a standard drop-select or an open numeric field that summons the numerals keyboard for number entries.
* **Selection removal** - Values reset to the default quantity of 1 when configuration parameters are removed or the item is deleted from the mini-cart.

[Quantity selector]: {{ site.baseurl }}{% link venia-pwa-concept/images/quantity-selector.png %}