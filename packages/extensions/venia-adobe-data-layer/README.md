# Venia Adobe Client Data Layer Extension

The goal of this extension is to load the [Adobe Client Data Layer][acdl] in an optimal way so that implementers of PWA Studio don't have to worry about it.

Note that the ACDL should _only_ be included once on your page/app, so if you use another extension or third party script that also loads the ACDL then you would _not_ want to use this extension. Please see [this issue][issue] for more information.

## Install

To install this extension, add it to the package.json of your scaffolded app, or `venia-concept` directory if you did not scaffold. For example:

```json
dependencies: {
  ...
  "@magento/venia-adobe-data-layer": "~1.0.0",
  ...
}
```

[acdl]: https://github.com/adobe/adobe-client-data-layer
[issue]: https://github.com/adobe/adobe-client-data-layer/issues/126
