---
title: Title bar component
---

| Description | Reference image              |
| ----------- | :--------------------------: |
| Title bar   | ![Title bar]{:width="300px"} |
{:style="table-layout:auto"}

## Visual specifications

The title is allowed to wrap and become two lines.
If it is longer than two lines, it is clipped and append with an ellipsis.

The price is vertically centered in the bar.

## Page states

* **Refresh** - loads a cached version

## Interactions

* **Scroll up** - Component disappears from the top on scroll and appended to the "Add to cart" bar.
* **Scroll down** - Not visible until the user scrolls to the top of the page.
* **Page refresh** - TBD

[Title bar]: {{ site.baseurl }}{% link venia-pwa-concept/images/title-bar.png %}
