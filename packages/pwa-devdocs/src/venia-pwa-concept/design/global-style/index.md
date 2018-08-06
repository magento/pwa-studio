---
title: Global style guide
---

{: .bs-callout .bs-callout-info}
**Note:**
This design specification is still in development.
If have any feedback or would like to join the PWA conversation, please join our [Slack][] channel.

This topic provides the global style rules and values used in the Venia theme.
Use this guide to style components that will fit within the Venia theme.

## Colors

{: .bs-callout .bs-callout-tip}
***Tip:** Color values are expressed in RGB format because it translates easier to `rgba()` values than HEX format.*

The Venia theme uses the following color classes in its design:

| CSS class         | RGB value                     | Usage            |
| ----------------- | ----------------------------- | ---------------- |
| `black`           | `rgb(0, 0, 0)`                |                  |
| `venia-border`    | `rgb(224, 224, 224)`          | Border color     |
| `venia-grey`      | `rgb(246, 246, 246)`          |                  |
| `venia-teal`      | `rgb(0, 134, 139)`            | Buttons          |
| `venia-text`      | `rgb(33, 33, 33)`             | General text     |
| `venia-text-alt`  | `rgb(117, 117, 117)`          | Alternative text |
| `venia-text-hint` | `rgb(158, 158, 158)`          | Hint text        |
| `mask.root`       | `rgb(0, 0, 0)` at 50% opacity | Mask overlay     |
{:style="table-layout:auto"}

## Font

Venia uses the open source [Muli font][] from Google in its design.

{: .bs-callout .bs-callout-info}
***Note:** If you are developing Venia themed components, you must install this font locally because the Muli font is currently not served by the backend server.*

If the browser cannot find or use this font, it defaults to the following OS specific fonts:

* **San Francisco** for Apple users
* **Roboto** for Android users
* **Segoe** for Windows users

### Size specifications

The Venia theme uses a root font size of **16px**.
All other elements, except images and media queries, use this base value to calculate their relative sizes using `rem`.

Examples using **16px** as the root font size:

| `rem` size values        | Calculated size        |
| ------------------------ | ---------------------- |
| `padding: 1rem;`         | `padding: 16px;`       |
| `border-radius: 1.5rem;` | `border-radius: 24px;` |
| `font-size: 0.75rem;`    | `font-size: 12px;`     |
{:style="table-layout:auto"}

### Font weights

The Venia theme uses a limited set of font weights in its design.
For optimal component performance, use no more than 3 font weight variations.

![Muli font weights][]{:width="350px"}

Venia uses the following weights:

| Common weight name | Value | Usage                                  |
| ------------------ | ----- | -------------------------------------- |
| Regular            | 400   | Regular text content                   |
| Semi-bold          | 600   | Highlight important pieces of text     |
| Bold               | 700   | Use only for the large text in banners |
{:style="table-layout:auto"}

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

Regarding layers, do not use the Z-Index to re-order items within a layer unless it is absolutely necessary.

## Animations

Use the following guidelines to make component animations feel efficient and quick.

| Animation property                      | Value                                   |
| --------------------------------------- | --------------------------------------- |
| Speed                                   | 8-16 milliseconds or 1 frame per second |
| Opening and entrance animation duration | 224 milliseconds                        |
| Closing and exit animation duration     | 192 milliseconds                        |
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

The Venia theme uses the open source [Feather][] icon set.

Examples:

| Name          | Icon                    |
| ------------- | ----------------------- |
| Search        | ![search-icon][]        |
| Menu          | ![menu-icon][]          |
| Shopping cart | ![shopping-cart-icon][] |
{:style="table-layout:auto"}

Each icon has a stroke width of **2px** and fits inside a **24px** square, except in buttons and carets, which have a size of **16px**.

[Slack]: https:/magentocommeng.slack.com/messages/C71HNKYS2
[Muli font]: https://fonts.google.com/specimen/Muli
[Root font size]: #root-font-size
[Masks and borders]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/borders-and-masks.png %}
[Muli font weights]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/muli-font-weights.png %}
[Feather]: https://feathericons.com/
[search-icon]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/search.svg %}
[menu-icon]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/menu.svg %}
[shopping-cart-icon]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/shopping-cart.svg %}