---
title: Frequently Asked Questions(FAQ)
adobeio: /guides/project/faq/
---

## How do I get started with PWA Studio

If you are developing a new storefront, the [PWA Studio fundamentals][] tutorial series provides an introduction to the different tools and features of PWA Studio.

If you want to learn about the technologies and concepts behind PWA Studio, the [Getting Started][] section of this site provides background information about this project.

If you are interested in looking at the project source or contributing to the project, check out the [project repository][].

## Does PWA Studio support server-side rendering (SSR)

Yes, PWA Studio provides tools that support both server-side and client-side rendering strategies.
For more information on content rendering support, see the [Content Rendering][] topic.

Community members have also suggested the following tools and services to address SEO and SSR needs:

-   [SeoSnap][]
-   [Prerender.io][]

## How do I customize a new storefront project

The Tutorials section of this site contains a number of tutorials which cover customizations such as:

-   [How to add a static route][]
-   [How to modify the site footer][]

## Are there any live stores built using PWA Studio

Yes, there are a few!
The community-created [PWA Studio Stats][] site lists some of these storefronts that are built using PWA Studio technologies.

## Which payment methods does PWA Studio support

PWA Studio supports Braintree payments out of the box in its Venia storefront implementation.
The project also supports adding other payment methods to a storefront project, but
it requires additional implementation for the storefront developer.

## How do I deploy to production

A PWA Studio storefront uses an UPWARD server as the backend for the frontend code.
Magento provides two different UPWARD server implementations, UPWARD-JS and UPWARD-PHP.

UPWARD-JS is a node implementation of an UPWARD server.
It is used during storefront development when you use the `yarn watch` command, but
you can use it for production by calling `yarn build` to generate production assets and `yarn start` to start a server.

UPWARD-PHP is a PHP implementation of an UPWARD server.
It is a dependency of the [Magento 2 UPWARD connector module][], which lets you run an UPWARD server on the same machine as your Magento 2 instance.
See the [Magento Cloud deployment][] tutorial to learn how to deploy your storefront on the Magento Cloud.

## Can I use Windows with PWA Studio for development

Developing with PWA Studio in Windows is not supported because of its incompatibility with some of the project's dependencies.

Currently, the PWA Studio core team does not have the bandwidth to develop and maintain a Windows development solution, but
community members have suggested the following workarounds:

-   Using Docker to spin up a Linux environment
-   Using the [Windows Subsystem for Linux][]

## How can I query other stores via GraphQL

To let the storefront query a specific store view in Magento you need to add the store code to these two files:

-   [packages/peregrine/lib/Router/resolveUnknownRoute.js][]

    -   Add `Store: YOUR_STORE_CODE`

-   [packages/venia-ui/lib/drivers/adapter.js][]

    -   Add `headers:{ Store: YOUR_STORE_CODE }`

## Image component loads wrongly sized images from the srcSet

When you use the `<Image/>` component from `venia-ui`, change the following values:

-   [packages/venia-ui/lib/util/images.js][]

    -   Change `DEFAULT_WIDTH_TO_HEIGHT_RATIO` to match your image ratio.
    -   Change the values in the `imageWidths` mapping to better fit your dimensions.

-   [packages/venia-ui/lib/components/gallery/item.js][]

    -   Supply the `<Image />` component with a `widths` prop as shown in the GalleryItem component defined in the linked file.

{: .bs-callout .bs-callout-info}
_**Note:** For testing, resize the viewport manually instead of using the native device emulator in Chrome, which gives incorrect values._

[getting started]: <{%link technologies/overview/index.md %}>

[pwa studio fundamentals]: <{%link tutorials/pwa-studio-fundamentals/index.md %}>

[content rendering]: <{% link technologies/basic-concepts/content-rendering/index.md %}>

[how to add a static route]: <{%link tutorials/pwa-studio-fundamentals/add-a-static-route/index.md %}>

[how to modify the site footer]: <{%link tutorials/pwa-studio-fundamentals/modify-site-footer/index.md %}>

[magento cloud deployment]: <{% link tutorials/cloud-deploy/index.md %}>

[project repository]: https://github.com/magento/pwa-studio

[seosnap]: https://seosnap.io/

[prerender.io]: https://prerender.io/

[pwa studio stats]: https://pwastudio-stats.com/

[magento 2 upward connector module]: https://github.com/magento/magento2-upward-connector

[windows subsystem for linux]: https://docs.microsoft.com/en-us/windows/wsl/install-win10

[packages/peregrine/lib/router/resolveunknownroute.js]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/Router/resolveUnknownRoute.js#L97

[packages/venia-ui/lib/drivers/adapter.js]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/drivers/adapter.js#L120

[packages/venia-ui/lib/util/images.js]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/util/images.js#L6

[packages/venia-ui/lib/components/gallery/item.js]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/Gallery/item.js#L18
