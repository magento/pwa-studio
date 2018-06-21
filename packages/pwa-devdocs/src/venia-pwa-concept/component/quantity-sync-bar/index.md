---
title: Quantity sync bar component
---

| Description                | Reference image                               |
| -------------------------- | :-------------------------------------------: |
| Quantity selector updating | ![Quantity selector updating]{:width="300px"} |
| Quantity selector updated  | ![Quantity selector updated]{:width="300px"}  |
{:style="table-layout:auto"}

[Quantity selector updating]: {{ site.baseurl }}{% link venia-pwa-concept/images/quantity-selector-updating.png %}
[Quantity selector updated]: {{ site.baseurl }}{% link venia-pwa-concept/images/quantity-selector-updated.png %}

## Page states

* **First load** - As the page loads, the bar loads with the current quantity
* **Offline** - The bar turns gray, but the most recent quantity is still shown.
* **Reload** - When the page come back online or reloaded by the user, the bar has a spinner that indicates it is syncing and updating the quantity.
* **Cached** - On revisits, the bar has a spinner that indicates it is syncing and updating the quantity.
