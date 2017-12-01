# PWA Module/Theme

[![CircleCI](https://circleci.com/gh/magento-research/pwa-module-theme.svg?style=svg&circle-token=8184a92e30a5842fbdafe7f2b86f49b794828f0d)](https://circleci.com/gh/magento-research/pwa-module-theme)

A temporary (private) location for the Magento PWA team to persist our work.

## Why not in the magento2ce repository?

The CI running time for the `magento2ce` forks are not pleasant to work with,
especially when you need to move quickly. Temporarily using our own repository
has a few benefits:

1. Allows us to configure our own CI process with just the tests we need for the
   client-side implementation
2. Allows us to keep our work private from the public, until the architecture
   has stabilized a bit more

## Setup

1. Clone the
   [Magento 2 Vagrant setup](https://github.com/paliarush/magento2-vagrant-for-developers)
   locally
2. Open the `Vagrantfile`, and find `config.vm.synced_folder '.', '/vagrant',
   disabled: true`. Then, before that line, add `config.vm.synced_folder
   '/Users/me/pwa-module-theme', '/Users/me/pwa-module-theme', type: "nfs",
   create: true`, where the specified path is the absolute path locally to your
   copy of this repository
3. Go through the normal setup process for the Vagrant box (`./init-project`).
4. On your host, `cd` to
   `magento2-vagrant-for-developers/magento2ce/app/code/Magento`, and run `ln -s
   /Users/me/pwa-module-theme/module Pwa`
5. On your host, `cd` to
   `magento2-vagrant-for-developers/magento2ce/app/design/frontend/Magento`, and
   run `ln -s /Users/me/pwa-module-theme/theme Rush`
6. Login to `/admin`, and change your store's theme to `Rush`
