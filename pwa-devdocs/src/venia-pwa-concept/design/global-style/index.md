---
title: Global style guide
---

{: .bs-callout .bs-callout-info}
**Note:**
This design specification is still in development.
If have any feedback or would like to join the PWA conversation, please join our [Slack](https://magentocommeng.slack.com/messages/C71HNKYS2) channel.

This topic provides the global style rules and values used in the Venia storefront.
Use this guide to style components that will fit within the Venia storefront.

## Layout

### Grids

Grid layouts should be in **multiples of 4** where possible, and
the gap, or _gutter_, between each grid cell should be in **multiples of `8rem`**.

### Borders

Use masks and borders instead of drop shadows to separate different sections and visual components.

![Masks and borders][]{:width="450px"}


Use the following values for borders:

| Property        | Value | Description                                 |
| --------------- | ----- | ------------------------------------------- |
| `border-radius` | `2px` | The roundness of an element's corner border |
| `border-width`  | `1px` | The width of an element's border            |
{:style="table-layout:auto"}

{: .bs-callout .bs-callout-info}
***Note:** For buttons, the `border-radius` is half the height of the button.
For example, a button with a height of `3rem` should have a `border-radius` of `1.5rem`.*

### Layers

Avoid using `z-index` to re-order items; instead, rely on document order where possible.
If you need to use the `z-index`, ensure that it is only used to re-order sibling elements within a single layer.

## Colors

{: .bs-callout .bs-callout-tip}
***Tip:** Color values are expressed in RGB format because it translates easier to `rgba()` values than HEX format.*

The Venia storefront uses the following [custom properties][] for color in its design:

| Custom property     | RGB value            | Usage            |
| ------------------- | -------------------- | ---------------- |
| `--venia-border`    | `rgb(224, 224, 224)` | Border color     |
| `--venia-grey`      | `rgb(246, 246, 246)` |                  |
| `--venia-teal`      | `rgb(0, 134, 139)`   | Buttons          |
| `--venia-text`      | `rgb(33, 33, 33)`    | General text     |
| `--venia-text-alt`  | `rgb(117, 117, 117)` | Alternative text |
| `--venia-text-hint` | `rgb(158, 158, 158)` | Hint text        |
{:style="table-layout:auto"}

Use the [`var()`][] function to use these custom properties in your style definitions:

``` css
.myComponent {
  border-color: rgb(var(--venia-border));
}
```

## Animations

Animations and transitions should run at a smooth 60 fps.
This can be achieved by setting the speed of the animation to increments of **16 milliseconds**, which is roughly 1 frame per second.

Use the following table as a reference for the ideal duration for different animation actions:

| Animation action               | Duration value   |
| ------------------------------ | ---------------- |
| Opening and entrance animation | 224 milliseconds |
| Closing and exit animation     | 192 milliseconds |
{:style="table-layout:auto"}

### Easing functions

Easing functions determine the speed up and slow down of animations.
They help make component interactions and movements look and feel natural.

Use the following table to determine which easing functions to use in your component animations:

| Function                             | Usage                                                       |
| ------------------------------------ | ----------------------------------------------------------- |
| `ease-in`, `ease-out`, `ease-in-out` | Movement-type animations, such as sliding or scrolling      |
| `linear`                             | Visual effects animations, such as color or opacity changes |

## Icons

The Venia storefront uses the open source [Feather][] icon set.
Each icon has a stroke width of **2px** and fits inside a **24px** square, except in buttons and carets, which have a size of **16px**.

Examples:

| Name          | Icon                    |
| ------------- | ----------------------- |
| Search        | ![search-icon][]        |
| Menu          | ![menu-icon][]          |
| Shopping cart | ![shopping-cart-icon][] |
{:style="table-layout:auto"}

[Slack]: https:/magentocommeng.slack.com/messages/C71HNKYS2
[Muli font]: https://fonts.google.com/specimen/Muli
[Root font size]: #root-font-size
[Masks and borders]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/borders-and-masks.png %}
[Muli font weights]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/muli-font-weights.png %}
[Feather]: https://feathericons.com/
[search-icon]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/search.svg %}
[menu-icon]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/menu.svg %}
[shopping-cart-icon]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/shopping-cart.svg %}
[custom properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
[`var()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/var
