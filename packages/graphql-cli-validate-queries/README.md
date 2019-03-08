# graphql-cli-validate-queries

Validate your project's GraphQL queries against a schema.

## Installation

```
yarn add graphql-cli graphql-cli-validate-queries
```

## Options

This plugin supports the following command line options:

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| `--clients`, `-c` | GraphQL clients in use in this project. | `array` | `["apollo"]` |
| `--filesGlob`, `-f` | A glob used to target files for validation. | `string` | `""` |
| `--insecure`, `-i` | Allow insecure (self-signed) certificates. | `boolean` | `false` |
| `--project`, `-p` | The project name as specified in `.graphqlconfig`. | `string` | `""` |

## Example

An example command follows:

```
graphql validate-queries --project venia --filesGlob \"src/**/*.{js,graphql,gql}\" --clients apollo literal
```

The plugin will tell you that _All queries are valid_, or it will output a list of errors it encountered.


