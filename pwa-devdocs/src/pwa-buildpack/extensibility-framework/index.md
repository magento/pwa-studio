---
title: Extensibility framework
---

PWA Studio's extensibility framework provides the tools you need to customize and extend your storefront without copying over code from the core PWA Studio project.
The extensibility framework gives developers the ability to:

- Extend the base Venia storefront with minimal core code duplication
- Create and install extensions for PWA Studio storefronts
- Create their own extendible modules and storefronts

## How it works

The extensibility framework uses a modular approach for modifying application behavior.
It applies configurations and customizations defined inside extensions you install in the project.

_Extensions_ for PWA Studio storefronts are normal NPM packages you install as a project dependency.
These packages contain instructions that affect the build process and static code output for the generated application bundles.
By modifying the output code during build time, there is no runtime performance cost associated with changing the storefront behavior.

This is different from a _plugin architecture_ where the application detects and dispatches plugins as the front end loads in the browser.
The more plugins you install with this architecture, the slower the application gets as it becomes bloated with overhead processes.

### Interceptor pattern



## Targets

### Targetables

## Intercept files

### Interceptors

## Extendible packages in PWA Studio

### Buildpack

### Peregrine

### Venia UI

## Testing extensions locally

## Examples