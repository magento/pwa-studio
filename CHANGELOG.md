# Release 7.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 7.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 7.0.0](#whats-new-in-700)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 7.0.0

PWA Studio 7.0.0 contains new features, refactors, and various improvements.

### Extensibility framework

### Standalone Cart and Checkout pages

### Standard Dialog component

### PWA Studio Fundamentals tutorials

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description | Change type | PR  |
| ----------- | ----------- | --- |

### Peregrine library

| Description | Change type | PR  |
| ----------- | ----------- | --- |

### Build tools

| Description | Change type | PR  |
| ----------- | ----------- | --- |

### Documentation

| Description | Change type | PR  |
| ----------- | ----------- | --- |

### Misc

| Description | Change type | PR  |
| ----------- | ----------- | --- |

## Upgrading from a previous version

The method for updating to 7.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
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

This method can be a chore, and we hope that some of the features in 5.0.0+ will help these users migrate to a package management approach.

### NPM packages

Some users have imported the PWA Studio libraries using NPM.
This is the easiest way to work with the released versions of PWA Studio.

#### Upgrade method: Update `package.json`

To upgrade to 7.0.0, update the project's `package.json` file and change the version string for any PWA Studio package dependencies.

[pwa studio releases]: https://github.com/magento/pwa-studio/releases