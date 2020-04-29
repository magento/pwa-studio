# Release 5.0.1

**NOTE:**
_This changelog only contains release notes for PWA Studio 5.0.1._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 5.0.1](#whats-new-in-501)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 5.0.1

PWA Studio 5.0.1 is a patch release to fix an Image loading issue and cache persistence issue.

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                      | Change type |    PR     |
| :------------------------------- | :---------: | :-------: |
| Fix images not loading correctly | **Bugfix**  | [#2164][] |

### Peregrine library

| Description                      | Change type |    PR     |
| :------------------------------- | :---------: | :-------: |
| Prevent invalid mutation caching | **Bugfix**  | [#2176][] |

## Upgrading from a previous version

The method for updating to 5.0.1 from a previous version depends on how PWA Studio is incorporated into your project.
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

This method can be a chore, and we hope that some of the features in 5.0.0 will help these users migrate to a package management approach.

### NPM packages

Some users have imported the PWA Studio libraries using NPM.
This is the easiest way to work with the released versions of PWA Studio.

#### Upgrade method: Update `package.json`

To upgrade to 5.0.1, update the project's `package.json` file and change the dependency version for PWA Studio.

[pwa studio releases]: https://github.com/magento/pwa-studio/releases
[client side caching topic]: https://pwastudio.io/technologies/basic-concepts/client-side-caching/
[`venia-upward.yml`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-concept/venia-upward.yml
[hello upward]: https://pwastudio.io/tutorials/hello-upward/simple-server/
[magento compatibility table]: https://pwastudio.io/technologies/magento-compatibility/
[react hooks]: https://reactjs.org/docs/hooks-intro.html

[#2164]: https://github.com/magento/pwa-studio/pull/2164
[#2176]: https://github.com/magento/pwa-studio/pull/2176
