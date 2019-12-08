---
title: Title bar component
---

| Description         | Pages used        | Reference image                        |
| ------------------- | ----------------- | :------------------------------------: |
| Title bar           | [Product][]  | ![Title bar]{:width="300px"}           |
| Title bar - Dresses | [Category][] | ![Title bar - dresses]{:width="300px"} |
{:style="table-layout:auto"}

[Category]: {% link venia-pwa-concept/design/category-page/index.md %}
[Product]: {% link venia-pwa-concept/design/product-page/index.md %}

## Visual specifications

For long titles, the content wraps and becomes two lines.
If the title is longer than two lines, the content is clipped and appended with an ellipsis.

The price is vertically centered in the bar.

## Page states

* **Refresh** - loads a cached version

## Interactions

* **Scroll up** - Component disappears from the top on scroll and appended to the "Add to cart" bar.
* **Scroll down** - Not visible until the user scrolls to the top of the page.
* **Page refresh** - TBD

[Title bar]: {% link venia-pwa-concept/images/title-bar.png %}
[Title bar - dresses]: {% link venia-pwa-concept/images/title-bar-dresses.png %}
