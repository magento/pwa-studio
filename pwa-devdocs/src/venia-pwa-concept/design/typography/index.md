---
title: Typography
---

Venia uses the open source [Muli font][] from Google in its design.

![Typography][];

{: .bs-callout .bs-callout-info}
**Note:**
*If you are developing Venia storefront components, you must install this font locally because the Muli font is currently not served by the backend server.*

If the browser cannot find or use this font, it defaults to the following OS specific fonts:

* **San Francisco** for Apple users
* **Roboto** for Android users
* **Segoe** for Windows users

### Size specifications

The Venia storefront uses a root font size of **16px**.
All other elements, except images and media queries, use this base value to calculate their relative sizes using `rem`.

Examples using **16px** as the root font size:

| `rem` size values        | Calculated size        |
| ------------------------ | ---------------------- |
| `padding: 1rem;`         | `padding: 16px;`       |
| `border-radius: 1.5rem;` | `border-radius: 24px;` |
| `font-size: 0.75rem;`    | `font-size: 12px;`     |
{:style="table-layout:auto"}

### Font weights

The Venia storefront uses a limited set of font weights in its design.
For optimal performance in your components, use no more than 3 font weight variations.

![Muli font weights][]

Venia uses the following weights in its design:

| Common weight name | Value | Usage                                  |
| ------------------ | ----- | -------------------------------------- |
| Regular            | 400   | Regular text content                   |
| Semi-bold          | 600   | Highlight important pieces of text     |
| Bold               | 700   | Use only for the large text in banners |
{:style="table-layout:auto"}

[Muli font]: https://fonts.google.com/specimen/Muli
[Muli font weights]: {{site.baseurl}}{% link venia-pwa-concept/design/global-style/images/muli-font-weights.png %}
[Typography]: {{site.baseurl}}{%link venia-pwa-concept/design/typography/images/typography.png %}
