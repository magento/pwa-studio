const graphQLConfig = require('./graphql.config');

const config = {
    parser: 'babel-eslint',
    plugins: ['react'],
    extends: ['@magento'],
    rules: {
        'no-prototype-builtins': 'off',
        'no-undef': 'off',
        'no-useless-escape': 'off',
        'react/jsx-no-literals': [
            'error',
            {
                allowedStrings: [],
                // Use ignoreProps: false to catch label/title/alt text, etc.
                // Has the downside of erroring on "id" and other string props.
                ignoreProps: true,
                noStrings: true
            }
        ]
    },
    overrides: [
        {
            files: ['**/*.gql*.js'],
            processor: '@graphql-eslint/graphql'
        },
        {
            files: ['*.graphql'],
            parser: '@graphql-eslint/eslint-plugin',
            parserOptions: {
                operations: graphQLConfig.documents,
                schema: graphQLConfig.schema,
                schemaOptions: {
                    assumeValid: true,
                    method: 'GET'
                },
                skipGraphQLConfig: true
            },
            plugins: ['@graphql-eslint'],
            rules: {
                '@graphql-eslint/known-directives': 'error',
                '@graphql-eslint/naming-convention': [
                    'error',
                    {
                        ObjectTypeDefinition: 'PascalCase',
                        allowLeadingUnderscore: true
                    }
                ],
                '@graphql-eslint/require-id-when-available': 'error'
            }
        }
    ]
};

module.exports = config;
