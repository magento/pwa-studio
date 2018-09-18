---
title: Header component
---

| Description           | Pages used                   | Reference image                                            |
| --------------------- | ---------------------------- | :--------------------------------------------------------: |
| Header                | [Product][]<br/>[Category][] | ![Header menu collapsed without cart item]{:width="400px"} |
| Header with cart item | [Product][]<br/>[Category][] | ![Header menu collapsed with cart item]{:width="400px"}    |
| Header with search    | [Homepage][]                 | ![Header menu with search]{:width="400px"}                 |
{:style="table-layout:auto"}


[Header menu collapsed without cart item]: {{ site.baseurl }}{% link venia-pwa-concept/images/header-menu-collapsed-without-cart-item.png %}
[Header menu collapsed with cart item]: {{ site.baseurl }}{% link venia-pwa-concept/images/header-menu-collapsed-with-cart-item.png %}
[Header menu with search]: {{site.baseurl}}{% link venia-pwa-concept/images/header-menu-with-search.png %}
## Page states

* **Refresh** - loads a cached version

## Interactions

* **Scroll up** - The Header turns into an icon with the menu/logo.
  When tapped, the header expands.
* **Scroll down** - The purchase bar sticks to the bottom of the screen.
* **Page refresh** - TBD

### Page specific interactions

| Page       | Interaction                                  |
| ---------- | -------------------------------------------- |
| [Homepage] | Loads with the search bar displayed and open |

[Homepage]: {{site.baseurl}}{% link venia-pwa-concept/design/homepage/index.md %}
[Product]: {{site.baseurl}}{% link venia-pwa-concept/design/product-page/index.md %}
[Category]: {{site.baseurl}}{% link venia-pwa-concept/design/category-page/index.md %}