# Venia PWA Concept

[![CircleCI](https://circleci.com/gh/magento-research/venia-pwa-concept.svg?style=svg&circle-token=8184a92e30a5842fbdafe7f2b86f49b794828f0d)](https://circleci.com/gh/magento-research/venia-pwa-concept)

## Setup

1. Clone the
   [Magento 2 Vagrant setup](https://github.com/paliarush/magento2-vagrant-for-developers)
   locally
2. Open the `Vagrantfile`, and find `config.vm.synced_folder '.', '/vagrant',
   disabled: true`. Then, before that line, add `config.vm.synced_folder
   '/Users/me/venia-pwa-concept', '/Users/me/venia-pwa-concept', type: "nfs",
   create: true`, where the specified path is the absolute path locally to your
   copy of this repository
3. Go through the normal setup process for the Vagrant box (`./init-project`).
4. On your host, `cd` to
   `magento2-vagrant-for-developers/magento2ce/app/code/Magento`, and run `ln -s
   /Users/me/venia-pwa-concept/module Pwa`
5. On your host, `cd` to
   `magento2-vagrant-for-developers/magento2ce/app/design/frontend/Magento`, and
   run `ln -s /Users/me/venia-pwa-concept/theme-frontend-venia venia`
6. Copy `.env.dist` to `.env` and update as necessary, i.e. with the correct host URL.
7. Run `npm install`. Note if you run inside the vagrant box you may need to install and [switch to a newer version of node](https://github.com/paliarush/magento2-vagrant-for-developers#switch-nodejs-versions).
8. If making changes, run `npm start` to start the development server.
9. Login to `/admin`, and change your store's theme to `venia`
