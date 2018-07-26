---
title: Sort
---

| Description  | Reference image                  |
| ------------ | :------------------------------: |
| Sort button  | ![Filter bar]{:width="300px"}    |
| Sort overlay | ![Category sort]{:width="300px"} |
{:style="table-layout:auto"}

[Filter bar]: {{site.baseurl}}{% link venia-pwa-concept/images/filter-bar.png %}
[Category sort]: {{site.baseurl}}{% link venia-pwa-concept/images/category-sort.png %}

## Visual specifications

### Button specifications

A button with the text: **Sort**.

### Overlay specifications

The sort overlay is anchored to the bottom, left, and right sides of the screen.
It masks the content below and should never be taller than 3/4 of the viewport height.

## Interactions

### Button interactions

* **Tap** - Tapping the **Sort** button pulls up an overlay from the bottom with sort parameters.

### Overlay interactions

* **Tap** - Tapping on the overlay dismisses the sorting sheet without applying the parameter.

  Tapping the **Apply** button in the overlay executes the sort using the parameters and moves the overlay downwards and out of view.