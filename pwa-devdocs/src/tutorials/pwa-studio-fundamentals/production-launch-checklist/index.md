---
title: Preparing to go live
---

## Overview

In this final section, you’re going to walk through some common steps for preparing a site to go live.

## Audit with Lighthouse

Quoting from the [Lighthouse website][]:

> Lighthouse is an open-source, automated tool for improving the quality of web pages. You can run it against any web page, public or requiring authentication. It has audits for performance, accessibility, progressive web apps (PWAs), and more.  
> Lighthouse is included in Chrome DevTools. Running its audit — and then addressing the errors it finds and implementing the improvements it suggests — is a great way to prepare your site to go live. It helps give you confidence that your site is as fast and accessible as possible.

Try it out!

First, you need to create a production build of your site. The PWA Studio development server is optimized for making development fast; But the site that it generates, while closely resembling a production version of the site, isn’t as optimized.

### Create a production build

1.  Stop the development server (if it’s still running) and run the following command:
```shell
yarn build
```
2.  View the production site locally. Run:
```shell
yarn start
```

### Run a Lighthouse audit

Now you’re going to run your first Lighthouse test.

If you haven’t already done so, open the site in Chrome Incognito Mode so no extensions interfere with the test. Then, open up the Chrome DevTools.

Click on the “Audits” tab.

Click “Run audit”. (It’ll then take a minute or so to run the audit). 
Once the audit is complete check the results. 
There may be some useful suggestions on how you can improve your site further.

## Deployment

As with the deployment of any application there are many points to consider and options available.
Here are some tips and information for deploying your PWA Studio app.

### Where to deploy 

If you are familiar with working with Magento but not PWA Studio or a decoupled storefront.
You may be expecting that your PWA Studio app needs to be deployed to the same server as your Magento instance.
While this is possible (see the [Magento Cloud deployment][] tutorial), it's certainly not required, 
and for scalability it is often better to host your PWA Studio app on a separate NodeJS server.

### PWA Studio Environment Variables

Once you have your NodeJS server selected and configured there are a few 
environment variables which you need to set in your projects `.env` file.

Open your projects `.env` file and review all the options.  Most notably

-   `MAGENTO_BACKEND_URL`
    Specify the URL for your Magento Backend.
-   `STAGING_SERVER_HOST`
    Depending on your network you will usually need to set this to `'0.0.0.0'` for your DNS settings to work correctly.
-   `STAGING_SERVER_PORT`
    Depending on your network you will usually need to set this to `80` for your DNS settings to work correctly.
-   `CHECKOUT_BRAINTREE_TOKEN`
    Specify a Braintree API token token to to use on your storefront.

### Starting the PWA Studio server in Production mode

1.  Generate the production build of your site.
```shell
yarn build
```
2.  Start the PWA Studio server in production mode.
```shell
NODE_ENV=production yarn start
```

### Set up PWA Studio to use your Production SSL Cert

TODO


## Learn more

-   [Magento Cloud deployment][]
-   [Braintree integration][]
-   [Environment variables][]

[Magento Cloud deployment]: {%link tutorials/cloud-deploy/index.md %}
[Braintree integration]: {%link venia-pwa-concept/features/braintree/index.md %}
[Environment variables]: {%link pwa-buildpack/reference/environment-variables/index.md %}
[Lighthouse website]: https://developers.google.com/web/tools/lighthouse/