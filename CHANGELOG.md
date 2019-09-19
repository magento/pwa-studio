# Release Ver 3.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 3.0.0 and above._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 3.0.0](#whats-new-in-300)
-   [Updating from 2.1.0](#updating-from-210)

## What's new in 3.0.0

PWA Studio 3.0.0 contains improvements, new features, and some breaking changes.

### Summary of major changes

-   **Peregrine hooks:**
    Custom [React Hooks][] that contain data and state management logic has been added to the Peregrine library.
    These hooks allow developers to easily create functional components that focus on presentational logic.
    These also allow for a more modular use of PWA logic and easier "restyling" of Venia (or any PWA storefront built using PWA Studio).

### Summary of breaking changes

-   PR [#1169][] includes the following breaking changes:

    -   Removed some public user actions
    -   Prop type removed in the `CreateAccount` component
    -   Deleted the `ErrorDisplay` component
    -   Deleted the `Input` component

-   PR [#1078][] includes the following breaking changes:

    -   `SearchBar` component converted into a React hook that uses custom Peregrine hooks

### Peregrine changes

| Change type | Description                         | PR        |
| ----------- | ----------------------------------- | --------- |
| Feature     | New custom React hooks              | [#1078][] |
| Update      | Upgrade `react-router-dom` to 5.0.0 | [#1063][] |

### UPWARD changes

| Change type | Description                     | PR                   |
| ----------- | ------------------------------- | -------------------- |
| Feature     | New resolver added: UrlResolver | [#1058][], [#1175][] |

### Venia changes

| Change type | Description                                                                 | PR        |
| ----------- | --------------------------------------------------------------------------- | --------- |
| Feature     | New SwatchTooltip component                                                 | [#956][]  |
| Feature     | Focus search input on search icon button click                              | [#1019][] |
| Update      | Improve the usability of the "Remove item" feature in the MiniCart          | [#882][]  |
| Tests       | Add component unit tests                                                    | [#1027][] |
| Bugfix      | Make Create Account and Sign In input style consistent                      | [#1169][] |
| Bugfix      | Populate **Create Account** fields with correct values after guest checkout | [#1153][] |
| Bugfix      | Fix expired guest cart errors                                               | [#1150][] |
| Bugfix      | Fix header logo width style                                                 | [#1070][] |
| Bugfix      | Disable adding to cart until product options are selected                   | [#1097][] |
| Bugfix      | Disable update cart button until product options are selected               | [#1125][] |
| Bugfix      | Update `div` tag with `Fragment`                                            | [#1103][] |
| Bugfix      | Fix configurable media loading issue                                        | [#1094][] |
| Bugfix      | Use placeholder in carousel while loading next image                        | [#1085][] |
| Bugfix      | Add `/` to graphql validation endpoint                                      | [#1045][] |
| Bugfix      | Fix `makeUrl` for Fastly                                                    | [#1039][] |
| Bugfix      | Hide menu item from navigation if it is disabled in the Magento admin       | [#1022][] |
| Bugfix      | Prevent adding to cart during rapid multi-clicking                          | [#910][]  |

### Buildpack changes

| Change type | Description                           | PR        |
| ----------- | ------------------------------------- | --------- |
| Update      | Update `workbox-webpack-plugin` to v4 | [#1102][] |

### Misc project changes

| Change type    | Description                             | PR                                         |
| -------------- | --------------------------------------- | ------------------------------------------ |
| Update         | Update eslint configuration version     | [#1088][]                                  |
| Infrastructure | CI/CD and DevOps fixes and improvements | [#1132][], [#1155][], [#1087][], [#1043][] |
| Infrastructure | GitHub template updates                 | [#1077][], [#1048][]                       |

## Documentation changes

| Change type   | Description                                                 | PR                                                                          |
| ------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| Documentation | Explainer comments added to the [`venia-upward.yml`][] file | [#1174][]                                                                   |
| Documentation | New reference docs for Peregrine hooks                      | [#1253][]                                                                   |
| Documentation | New [Client side caching topic][]                           | [#1152][]                                                                   |
| Documentation | [Hello UPWARD][] tutorial                                   | [#1080][]                                                                   |
| Update        | Add explanation to [Magento compatibility table][]          | [#1059][]                                                                   |
| Feature       | Documentation linting tool added                            | [#1140][], [#1177][]                                                        |
| Bugfix        | Editorial and minor content fixes                           | [#1171][], [#1167][], [#1158][], [#1139][], [#1109][], [#1020][], [#1000][] |

## Updating from 2.1.0

The method for updating to 3.0.0 from 2.1.0 depends on how PWA Studio is incorporated into your project.
The following are common use cases we have identified and how to update the project code.

### PWA Studio fork

Many PWA Studio users have forked the PWA Studio Git repository.
Even though their codebase may have diverged a great deal from the current codebase, there is still a Git relationship.

#### Upgrade method: Update using Git

_Pull_ and _Merge_ the changes from the upstream repository using Git.
Most of the conflicts will be in components that we have fully refactored.

We recommend merging the library code we changed and updating component calls with any new prop signatures introduced in this version.

### Manual code copies

Some PWA Studio users have copied parts of the code into their own projects.
This is similar to the Git workflow, but without the merging tools Git provides.

#### Upgrade method: Manual copy updates

Updating this code involves manually copying updates for the code they use.
New code may also need to be copied over if the updated code depends on it.

This method can be a chore, and we hope that some of the features in 3.0.0 will help these users migrate to a package management approach.

### NPM packages

Some users have imported the PWA Studio libraries using NPM.
This is the easiest way to work with the released versions of PWA Studio.

#### Upgrade method: Update `package.json`

To upgrade to 3.0.0, update the project's `package.json` file and change the dependency version for PWA Studio.

[pwa studio releases]: https://github.com/magento/pwa-studio/releases
[client side caching topic]: https://pwastudio.io/technologies/basic-concepts/client-side-caching/
[`venia-upward.yml`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-concept/venia-upward.yml
[hello upward]: https://pwastudio.io/tutorials/hello-upward/simple-server/
[magento compatibility table]: https://pwastudio.io/technologies/magento-compatibility/
[react hooks]: https://reactjs.org/docs/hooks-intro.html
[#1253]: https://github.com/magento/pwa-studio/pull/1253
[#1177]: https://github.com/magento/pwa-studio/pull/1177
[#1058]: https://github.com/magento/pwa-studio/pull/1058
[#1175]: https://github.com/magento/pwa-studio/pull/1175
[#1174]: https://github.com/magento/pwa-studio/pull/1174
[#1171]: https://github.com/magento/pwa-studio/pull/1171
[#1169]: https://github.com/magento/pwa-studio/pull/1169
[#1167]: https://github.com/magento/pwa-studio/pull/1167
[#1158]: https://github.com/magento/pwa-studio/pull/1158
[#1155]: https://github.com/magento/pwa-studio/pull/1155
[#1153]: https://github.com/magento/pwa-studio/pull/1153
[#1152]: https://github.com/magento/pwa-studio/pull/1152
[#1150]: https://github.com/magento/pwa-studio/pull/1150
[#1140]: https://github.com/magento/pwa-studio/pull/1140
[#1139]: https://github.com/magento/pwa-studio/pull/1139
[#1132]: https://github.com/magento/pwa-studio/pull/1132
[#1070]: https://github.com/magento/pwa-studio/pull/1070
[#1125]: https://github.com/magento/pwa-studio/pull/1125
[#1109]: https://github.com/magento/pwa-studio/pull/1109
[#1103]: https://github.com/magento/pwa-studio/pull/1103
[#1102]: https://github.com/magento/pwa-studio/pull/1102
[#1097]: https://github.com/magento/pwa-studio/pull/1097
[#1094]: https://github.com/magento/pwa-studio/pull/1094
[#1088]: https://github.com/magento/pwa-studio/pull/1088
[#1087]: https://github.com/magento/pwa-studio/pull/1087
[#1085]: https://github.com/magento/pwa-studio/pull/1085
[#1080]: https://github.com/magento/pwa-studio/pull/1080
[#1077]: https://github.com/magento/pwa-studio/pull/1077
[#1063]: https://github.com/magento/pwa-studio/pull/1063
[#1059]: https://github.com/magento/pwa-studio/pull/1059
[#1048]: https://github.com/magento/pwa-studio/pull/1048
[#1045]: https://github.com/magento/pwa-studio/pull/1045
[#1039]: https://github.com/magento/pwa-studio/pull/1039
[#1027]: https://github.com/magento/pwa-studio/pull/1027
[#1022]: https://github.com/magento/pwa-studio/pull/1022
[#1020]: https://github.com/magento/pwa-studio/pull/1020
[#1019]: https://github.com/magento/pwa-studio/pull/1019
[#1000]: https://github.com/magento/pwa-studio/pull/1000
[#956]: https://github.com/magento/pwa-studio/pull/956
[#910]: https://github.com/magento/pwa-studio/pull/910
[#882]: https://github.com/magento/pwa-studio/pull/882
[#1078]: https://github.com/magento/pwa-studio/pull/1078
[#1043]: https://github.com/magento/pwa-studio/pull/1043
