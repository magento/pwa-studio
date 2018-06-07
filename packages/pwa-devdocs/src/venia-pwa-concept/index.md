---
title: Venia Theme (Concept)
---

The Venia theme is a proof-of-concept Magento theme built using [PWA Buildpack] tools and [Peregrine] components.
In its current, experimental state, the theme contains examples for Product Details and Category pages.

The [`venia-pwa-concept`] project itself contains a module and theme.

## PWA module

The `module` directory contains the code for a helper module for all Magento PWA Studio themes.
This module provides the following server-side functionality:

* Renders an app shell with the proper meta information in the `<head />` of each page.
* Assigns a `RootComponent` to an entity or group of entities without requiring a deployment. (**In development**)
* Embeds GraphQL payloads into the initial server render without requiring a round trip to the API after the web app has initialized on the client side. (**In development**)

## Venia theme

The `theme-frontend-venia` directory contains the code for the Venia theme itself.
This directory contains the files required for a Magento theme along with files that define pages and components.

## Contribute

Visit the [`venia-pwa-concept`] repository to contribute to the development of this project.

[`venia-pwa-concept`]: https://github.com/magento-research/venia-pwa-concept
[PWA Buildpack]: {{ site.baseurl }}{% link pwa-buildpack/index.md %}
[Peregrine]: {{ site.baseurl }}{% link peregrine/index.md %}