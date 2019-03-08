# GraphQL Validation Support

## Issue

[#952](https://app.zenhub.com/workspaces/pwa-studio-5b23bf79d195c635a1a218ce/issues/magento-research/pwa-studio/952).

## Goals

1. Move the `validate-queries` logic out of `venia-concept` and into `pwa-buildpack`
1. `build` includes a validation step which displays schema problems / mismatches
1. There is a smart error message shown when the build detects that a schema breakage is likely due to Magento upgrades
1. There is a smart error message shown when the build detects that a schema breakage is likely due to custom attribute upgrades

## Notes

* Magento backend URL (`2.3.0`): https://release-dev-rxvv2iq-zddsyhrdimyra.us-4.magentosite.cloud/
* Magento backend URL (`2.3.1`): https://release-dev-231-npzdaky-zddsyhrdimyra.us-4.magentosite.cloud/

### Current

* Venia runs `validate-queries` script as part of `build` script in its `package.json`.
* `yarn workspaces run build` runs the `build` command in each workspace

Running `validate-queries` against `2.3.0`: 

```
aterrano venia-concept (zetlen/graphql-change-mgmt) $ yarn run validate-queries
yarn run v1.13.0
$ node ./validate-queries.js
Using environment variables from .env
Validating queries based on schema at https://release-dev-rxvv2iq-zddsyhrdimyra.us-4.magentosite.cloud/graphql...
Retrieved introspection query. Configuring validator...
All queries valid against attached GraphQL API.
✨  Done in 6.30s.
```

Running `validate-queries` against `2.3.1`: 

```
aterrano venia-concept (zetlen/graphql-change-mgmt) $ yarn run validate-queries
yarn run v1.13.0
$ node ./validate-queries.js
Using environment variables from .env
Validating queries based on schema at https://release-dev-231-npzdaky-zddsyhrdimyra.us-4.magentosite.cloud/graphql...
Retrieved introspection query. Configuring validator...
Errors found!

 
/Users/aterrano/code/pwa-studio/packages/venia-concept/src/queries/getCategory.graphql
  11:21  error  Field "small_image" of type "ProductImage" must have a selection of subfields. Did you mean "small_image { ... }"?  graphql/template-strings

/Users/aterrano/code/pwa-studio/packages/venia-concept/src/queries/getCategoryList.graphql
  15:21  error  Field "small_image" of type "ProductImage" must have a selection of subfields. Did you mean "small_image { ... }"?  graphql/template-strings

/Users/aterrano/code/pwa-studio/packages/venia-concept/src/queries/getNavigationMenu.graphql
  21:11  error  Field "small_image" of type "ProductImage" must have a selection of subfields. Did you mean "small_image { ... }"?  graphql/template-strings

/Users/aterrano/code/pwa-studio/packages/venia-concept/src/queries/getProductDetail.graphql
  14:13  error  Field "description" of type "ComplexTextValue" must have a selection of subfields. Did you mean "description { ... }"?  graphql/template-strings

/Users/aterrano/code/pwa-studio/packages/venia-concept/src/queries/productSearch.graphql
  6:13  error  Field "small_image" of type "ProductImage" must have a selection of subfields. Did you mean "small_image { ... }"?  graphql/template-strings

✖ 5 problems (5 errors, 0 warnings)


  These errors may indicate:
  -  an out-of-date Magento 2.3 codebase running at "https://release-dev-231-npzdaky-zddsyhrdimyra.us-4.magentosite.cloud/"
  -  an out-of-date project codebase whose queries need updating

Use GraphiQL or another schema exploration tool on the Magento store to learn more.
  
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

### Solution Details

We created a `graphql-cli` plugin called `validate-queries` that lives at `packages/graphql-cli-validate-queries`.

Venia will depend on `graphql-cli` and this `validate-queries` plugin to do the work of validating the queries,
replacing the need for `validate-queries.js` in `packages/venia-concept/` itself.

Venia's `package.json` will include a script that runs a `graphql-cli-validate-queries` command that runs our plugin. `graphql-cli` takes care of wiring all of that up for us.

### New Tools / Dependencies

* [graphql-config](https://github.com/prisma/graphql-config)
* [graphql-cli](https://github.com/graphql-cli/graphql-cli)
* [graphql-request](https://github.com/prisma/graphql-request)
* [Example graphql-cli plugin](https://github.com/graphql-cli/graphql-cli/tree/master/plugin-example)

### TBDs & TODOs

* See if we can add the PWA -> Magento compatibility definitions to the root `package.json`.
  * We might be able to extend the `engines` field?
* Is `graphql-cli`'s [diff](https://oss.prisma.io/content/graphql-cli/07-schema-diff) command useful?
  * The idea would be: [get-schema](https://oss.prisma.io/content/graphql-cli/06-schema-handling) to get the current backend's schema, and compare it to known Magento GraphQL schemas
  * Requires these GraphQL schemas to be known to PWA at build time
* Are we using `graphql-cli`'s [lint](https://oss.prisma.io/content/graphql-cli/09-lint) command? "Running graphql lint will emit validation errors against the schema.".
* Should this go in `pwa-buildpack` or `venia-concept`? I think `peregrine` will need it too.
  * Future concern?
* Publish plugin to NPM registry, install it from there.
    * Tag it with `graphql`, `cli`, and `plugin`
* Clean up dependencies of plugin
* `yarn unlink` and make sure everything still works
