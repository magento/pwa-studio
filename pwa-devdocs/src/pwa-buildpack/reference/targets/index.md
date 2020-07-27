---
title: Extensibility Targets
---

Buildpack's targets follow the same Target API as other packages' targets, but they play a unique role. Buildpack targets are the fundamental "roots" of the PWA Studio Target system.

All other Targets operate by intercepting other Targets.
Targets can only be called when Buildpack core code creates a BuildBus, which it does for every build and for many commands.
Extensions will then run their declare and intercept files, attaching interceptor functions to each others' dependencies.
Still, nothing _calls_ targets to run any interceptors until Buildpack begins the process, by directly invoking one of its _own_ targets.

The Buildpack targets are therefore very generic and low-level. They are meant to be used as building blocks for higher-level targets which provide a convenient API for some common business purpose, such as adding routing or navigation logic.

Even deeper than Buildpack targets are the very similar Hooks that make up [Webpack's plugin system](https://v4.webpack.js.org/api/plugins/). Interceptors can use Buildpack's `webpackCompiler` target to acquire a reference to the Webpack Compiler object for each build, and can then do anything a Webpack plugin can do.
Because of their similarity in form and function, the PWA Studio Targets system integrates seamlessly into the larger Webpack ecosystem as a commerce-driven superset of its functionality.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/pwa-buildpack/lib/BuildBus/declare-base.md %}
