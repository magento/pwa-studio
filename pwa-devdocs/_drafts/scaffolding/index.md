---
title: scaffolding
---

A project using PWA Studio should not need to be a fork of the PWA Studio core repository. Instead, it should use the PWA Studio libraries Magento publishes to the NPM package repository.
The `venia-concept` package is a good example of a starter application using PWA Studio: it has very little code in its own folder, and it gets almost all of its UI and logic from the `@magento/venia-ui` and `@magento/peregrine` dependencies!
If you want to replace some venia-ui code with your own, it's as simple as importing small pieces of `venia-ui` and combining them yourself, instead of importing large pieces of `venia-ui` and using them unmodified. The `venia-concept` folder is a great template for starting that work.

## The `@magento/create-pwa` command

