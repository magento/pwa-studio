# GraphQL Validation Support

We created a `graphql-cli` plugin called `validate-magento-pwa-queries` that lives at `packages/graphql-cli-validate-magento-pwa-queries`.

Venia depends on `graphql-cli` and this `validate-magento-pwa-queries` plugin to do the work of validating the queries,
replacing the need for `validate-queries.js` in `packages/venia-concept/` itself.

Venia's `package.json` includes a script called `validate-queries` that runs our plugin.

### New Tools / Dependencies / Further Reading

* [graphql-config](https://github.com/prisma/graphql-config)
* [graphql-cli](https://github.com/graphql-cli/graphql-cli)
