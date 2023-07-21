---
title: Transform Requests
adobeio: /api/buildpack/transform-requests/
---

The built-in [`transformModules`][] target is a powerful way to customize the build process for a partiular file or set of files.
Many common Targets are implemented using the `transformModules` target and a custom transformer module.

Interceptors of this target receive a single function as their first argument. This is the `addTransform` function documented below.

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/pwa-buildpack/lib/WebpackTools/ModuleTransformConfig.md %}


[`transformModules`]: {%link pwa-buildpack/reference/targets/index.md %}#module_BuiltinTargets.transformModules
