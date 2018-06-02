# Venia PWA Concept

[![CircleCI](https://circleci.com/gh/magento-research/venia-pwa-concept.svg?style=svg&circle-token=8184a92e30a5842fbdafe7f2b86f49b794828f0d)](https://circleci.com/gh/magento-research/venia-pwa-concept)

## Setup

1. Clone the [Magento 2 Vagrant setup](https://github.com/paliarush/magento2-vagrant-for-developers) locally.
2. Copy `etc/config.yaml.dist` as `etc/config.yaml` and update it to use Magento v2.3-develop and PHP7.1  by changing:<br />
`ce: "git@github.com:magento/magento2.git"` to 
`ce: "git@github.com:magento/magento2.git::2.3-develop"`.<br />
And by changing `php_version: "7.0"` to `php_version: "7.1"`
3. Open the `Vagrantfile`, and find `config.vm.synced_folder '.', '/vagrant',
   disabled: true`. Then, before that line, add `config.vm.synced_folder
   '/Users/me/venia-pwa-concept', '/Users/me/venia-pwa-concept', type: "nfs",
   create: true`, where the specified path is the absolute path locally to your
   copy of this repository
4. Go through the normal setup process for the Vagrant box (`./init-project`).
5. On your host, `cd` to
   `magento2-vagrant-for-developers/magento2ce/app/code/Magento`, and run `ln -s
   /Users/me/venia-pwa-concept/module Pwa`
6. On your host, `cd` to
   `magento2-vagrant-for-developers/magento2ce/app/design/frontend/Magento`, and
   run `ln -s /Users/me/venia-pwa-concept/theme-frontend-venia venia`
7. Copy `.env.dist` to `.env` and update as necessary, i.e. with the correct host URL.
8. Run `npm install`. Note if you run inside the vagrant box you may need to install and [switch to a newer version of node](https://github.com/paliarush/magento2-vagrant-for-developers#switch-nodejs-versions).
9. If making changes, run `npm start` to start the development server.
10. On your host, `cd` to your Magento installation root `magento2-vagrant-for-developers/magento2ce/` and `bin/magento setup:upgrade` to install the necessary module files that were linked in step 5.
11. Login to `/admin`, and change your store's theme to `venia`
 
