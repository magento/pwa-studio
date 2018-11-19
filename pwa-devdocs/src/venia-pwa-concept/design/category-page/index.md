---
title: Category page
---

{: .bs-callout .bs-callout-info}
**Note:**
This design specification is still in development.
If have any feedback or would like to join the PWA conversation, please join our [Slack][] channel.

## Layout

See the [interactive mockup][] for a preview of the homepage layout.

## Page states

The category page handles the following [Page][] states:

* Refresh
* Offline
* Revisit
* Cached

## Components

The following components make up the category page:

* [Header][]
* [Title bar][]
* [Main image][]
* [Sort][]
* [Filter][]
* [Number of items][]
* [Product listing][]
* [Show more][]
* [Footer][]

The following table shows a visual breakdown of these components.

| Components                                    | Reference image                                             |
| :-------------------------------------------: | :---------------------------------------------------------: |
| **Header**                                    | [![Header image]{:width="250px"}][Header]                   |
| **Title bar**                                 | [![Title bar image]{:width="250px"}][Title bar]             |
| **Main image**                                | [![Main image image]{:width="250px"}][Main image]           |
| **Filter** / **Sort**<br/>**Number of items** | [![Filter bar]{:width="250px"}][Sort]                       |
| **Product listing**                           | [![Product listing image]{:width="250px"}][Product listing] |
| **Show more**                                 | [![Show more image]{:width="250px"}][Show more]             |
| **Footer**                                    | [![Footer image]{:width="250px"}][Footer]                   |
{:style="table-layout:auto"}

[Header]: {{ site.baseurl }}{% link venia-pwa-concept/component/header/index.md %}
[Header image]: {{ site.baseurl }}{% link venia-pwa-concept/images/header-menu-collapsed-with-cart-item.png %}

[interactive mockup]: https://magento.invisionapp.com/share/WQN5F7BYBPG#/screens/310613672

[Title bar image]: {{ site.baseurl }}{% link venia-pwa-concept/images/title-bar-dresses.png %}
[Title bar]: {{ site.baseurl }}{% link venia-pwa-concept/component/title-bar/index.md %} 

[Main image image]: {{site.baseurl}}{% link venia-pwa-concept/images/main-image.png %}
[Main image]: {{site.baseurl}}{% link venia-pwa-concept/component/main-image/index.md %}

[Filter bar]: {{site.baseurl}}{% link venia-pwa-concept/images/filter-bar.png %}
[Sort]: {{site.baseurl}}{% link venia-pwa-concept/component/sort/index.md %}
[Filter]: {{site.baseurl}}{% link venia-pwa-concept/component/filter/index.md %}
[Number of items]: {{site.baseurl}}{% link venia-pwa-concept/component/number-of-items/index.md %}

[Product listing image]: {{site.baseurl}}{% link venia-pwa-concept/images/product-listing.png %}
[Product listing]: {{site.baseurl}}{% link venia-pwa-concept/component/product-listing/index.md %}

[Show more image]: {{site.baseurl}}{% link venia-pwa-concept/images/show-more.png %}
[Show more]: {{site.baseurl}}{% link venia-pwa-concept/component/show-more/index.md %}

[Footer]: {{ site.baseurl }}{% link venia-pwa-concept/component/footer/index.md %} 
[Footer image]: {{ site.baseurl }}{% link venia-pwa-concept/images/footer-full.png %}

[Page]: {{site.baseurl}}{% link venia-pwa-concept/component/page/index.md %}

[Slack]: https:/magentocommeng.slack.com/messages/C71HNKYS2
