---
title: Object types
---

This is a list of common object types shared between the PWA-Buildpack modules.

## `LocalProjectLocation`

| Property: Type   | Description                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| `root: string`   | The absolute path of the project's root directory on the working filesystem. |
| `output: string` | The directory where webpack should output any built assets.                  |
{:style="table-layout:auto"}

### Output location

If the value for `LocalProjectLocation.output` is relative, the location is resolved from `root`.