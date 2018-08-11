---
title: Filter
---

| Description            | Reference image                       |
| ---------------------- | :-----------------------------------: |
| Filter button          | ![Filter bar]{:width="300px"}         |
| Filter overlay         | ![Filter overlay]{:width="300px"}     |
| Filter color parameter | ![Filter color param]{:width="300px"} |
| Filter values          | ![Filter values]{:width="300px"}      |
{:style="table-layout:auto"}

[Filter bar]: {{site.baseurl}}{% link venia-pwa-concept/images/filter-bar.png %}
[Filter overlay]: {{site.baseurl}}{% link venia-pwa-concept/images/filter-overlay.png %}
[Filter color param]: {{site.baseurl}}{% link venia-pwa-concept/images/filter-color.png %}
[Filter values]: {{site.baseurl}}{% link venia-pwa-concept/images/filter-values.png %}

## Visual specifications

On the filter overlay, the filter parameters appear as accordions.

To make the best use of limited screen real estate, only one accordion is open at any given time, so
opening the second accordion closes the current open accordion.

The number of variables within a parameter appears on the right and aligns with the accordion heading.

The two footer buttons, **Reset All Filters** and **Apply All Filters**, show as disabled until the user selects sets a filter.

## Interactions

* **Tap** - Tapping the **Filter** button brings up a full-screen filter overlay.
    Depending on the implementation, the overlay can appear from the same direction as the mini cart or from the bottom.

    Shoppers make filter selections within an open parameter's accordion.

    Tapping on the '**-**' icon clears the variables for a parameter.

* **Search** - Like product search, shoppers can search for a filter using keywords.
