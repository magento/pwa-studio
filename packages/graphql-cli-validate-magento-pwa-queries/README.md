[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) [![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)


# graphql-cli-validate-magento-pwa-queries

Validate your project's GraphQL queries against a schema.

## Installation

```
yarn add graphql-cli graphql-cli-validate-magento-pwa-queries
```

## Summary

Given the following `.graphqlconfig`:

```
{
    "projects": {
        "myApp": {
            "schemaPath": "mySchema.json",
            "extensions": {
                "endpoints": {
                    "default": "https://myEndpoint.com/graphql"
                },
                "validate-magento-pwa-queries": {
                    "clients": ["apollo", "literal"],
                    "filesGlob": "src/**/*.{js,graphql,gql}"
                }
            }
        }
    }
}
```

The command 
```
graphql-cli get-schema --project myApp
```
will [download the GraphQL schema](https://oss.prisma.io/content/graphql-cli/06-schema-handling)
from `https://myEndpoint.com/graphql` and store it in `mySchema.json`.

Then the command 
```
graphql-cli validate-magento-pwa-queries --project myApp
```

will validate all `apollo` and `literal` GraphQL queries it finds in `.js`, `.graphql`, or `.gql` files in the `src/` directory
against that schema.

## Options

This plugin supports the following command line options:

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| `--project`, `-p` | The project name as specified in `.graphqlconfig`. | `string` | `""` |

You can also specifiy the following options in your `.graphqlconfig`:

| Option | Description | Type |
| --- | --- | --- |
| `--clients`, `-c` | GraphQL clients in use in this project. | `array` |
| `--filesGlob`, `-f` | A glob used to target files for validation. | `string` |

## Further Reading

* [graphql-config](https://github.com/prisma/graphql-config)
* [graphql-cli](https://github.com/graphql-cli/graphql-cli)
* [eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql)
* [graphql/no-deprecated-fields rule](https://github.com/apollographql/eslint-plugin-graphql#no-deprecated-fields-validation-rule)


