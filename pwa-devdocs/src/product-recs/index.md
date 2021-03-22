---
title: Integrating Product Recommendations
---

You can integrate Product Recommendations powered by [Adobe Sensei](https://www.adobe.com/sensei.html) into your PWA storefront.
## Integration overview

![Product Recommendations for PWA Studio](images/pwa-arch-diag-sensei.svg)

Magento's [Product Recommendations powered by Adobe Sensei](https://docs.magento.com/user-guide/marketing/product-recommendations.html) is a feature backed by several SaaS services.
The **Store** side includes your PWA storefront, which contains the event collector and recommendations layout template, and the backend, which includes the GraphQL endpoints, SaaS Export module, and the Admin UI.

After you install the Product Recommendations PWA extension on your store, it will start sending [behavioral data](https://devdocs.magento.com/recommendations/events.html) to Adobe Sensei.
Adobe Sensei processes this behavioral data along with the catalog data from the Magento backend and calculates the product associations leveraged by the recommendations service.
At this point, the merchant can create and manage recommendation units from the Magento Admin UI then fetch those product recommendation units from their PWA storefront.

## Install the Product Recommendations module

Product Recommendations support on PWA requires installing the `venia-product-recommendations` module and the Product Recommendations Magento module.

1. You can install the PWA `venia-product-recommendations` package from the NPM registry:

   ```sh
   npm install @magento/venia-product-recommendations
   ```
   This package contains everything you need to collect behavioral data and render the recommendations. Some recommendation types use behavioral data from your shoppers to train machine learning models that build personalized recommendations. Other recommendation types use catalog data only and do not use any behavioral data. See the [Magento user guide](https://docs.magento.com/user-guide/marketing/product-recommendations.html#trainmlmodels) to learn how Adobe Sensei trains machine learning models that results in higher quality recommendations.

1. To install the Magento Product Recommendations backend module, see the [Magento developer documentation](https://devdocs.magento.com/recommendations/install-configure.html).
This module expands Magento's existing GraphQL API to include fields that are used to fetch the recommendations from the Recommendations Service.

## Create recommendation units

Creating a product recommendation unit for your PWA storefront is similar to [creating one for a Magento storefront](https://docs.magento.com/user-guide/marketing/create-new-rec.html).
The difference is that after you create a recommendation unit, you then need to add code to your PWA storefront to explicitly fetch the recommendation unit from the Magento backend. You can use one of the methods described below.

## Fetch recommendations

There are three ways you can fetch product recommendations from your PWA storefront.
If you are using Venia as a the base storefront, PWA Studio provides components that track and collect behavioral events as well as components that render the recommendation units on your page.
If you are not using Venia UI components in your storefront project, there are other options available to you.

### Venia UI component

The `Recommendations` component is part of the [venia-ui package]: {% link technologies/overview/#custom-react-hooks-and-component %}.
It contains React components that do the following:

-  Collect and send behavioral data to Adobe Sensei
-  Fetch recommendations from the recommendations service
-  Render the recommendation unit to your storefront page

#### Example

```jsx
//Render recommendations using visual component
return <Recommendations pageType={CMS} />
```
### Fetch data only

If you are not using the `venia-ui` package, you can call the recommendations service and receive a JSON payload.
#### Example

```js
import {CMS} from "@magento/{nameOfOurPackagesThatIsTBD}/lib/recommendations/constants"
import useRecsData from "@magento/{nameOfOurPackagesThatIsTBD}/lib/recommendations/hooks/useRecsData"
```
Because this method does not automatically collect and send behavioral data from your storefront to Adobe Sensei, you will need to add it:

```js
import useRecsWithTrackingProps from "@magento/{nameOfOurPackagesThatIsTBD}/lib/recommendations/hooks/useRecsWithTrackingProps"
import Recommendations from "@magento/{nameOfOurPackagesThatIsTBD}/lib/recommendations/components/Recommendations"
```
### Wrapper functions

To abstract the raw JSON, you can use wrapper functions that collect and send behavioral data from your storefront to Adobe Sensei and fetch recommendation units from the Recommendations service.
#### Example

```js
//recommendations JSON
const recsData = useRecsData({pageType: CMS})
//recommendations JSON with data tracking functions and props spread across
const recsWithTrackingProps useRecsWithTrackingProps({pageType: CMS})
```

If not using the `venia-ui` package, you will need to write code that renders the fetched recommendation unit on your PWA storefront.
