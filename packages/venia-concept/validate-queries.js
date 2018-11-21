process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const magentoDomainVarName = 'MAGENTO_BACKEND_URL';
let magentoDomain;

async function validateQueries(validEnv, log = console.log.bind(console)) {
    if (process.env.NODE_ENV === 'production') {
        log(`NODE_ENV=production, skipping query validation`);
        return false;
    }
    magentoDomain = validEnv[magentoDomainVarName];

    const { URL } = require('url');
    let uri;
    try {
        uri = new URL('/graphql', magentoDomain);
    } catch (e) {
        return `Could not build a GraphQL endpoint URL from env var ${magentoDomainVarName}: '${magentoDomain}'.`;
    }

    const { gql, HttpLink, makePromise, execute } = require('apollo-boost');
    const { getIntrospectionQuery, introspectionQuery } = require('graphql');

    const query = gql(
        getIntrospectionQuery ? getIntrospectionQuery() : introspectionQuery
    );

    const link = new HttpLink({ uri, fetch: require('node-fetch') });

    async function getSchema() {
        log(`Validating queries based on schema at ${uri.href}...`);
        const result = await makePromise(execute(link, { query }));
        if (result.errors) {
            const errorMessages = `The introspection query to ${
                uri.href
            } failed with the following errors:\n\t- ${result.errors
                .map(({ message }) => message)
                .join('\n\t- ')}`;
            if (
                errorMessages.includes('GraphQL introspection is not allowed')
            ) {
                throw new Error(
                    `Cannot validate queries because the configured Magento backend ${
                        uri.href
                    } disallows introspection in "production" mode. If you can do so, set this Magento instance to "developer" mode.\n\n${errorMessages}`
                );
            } else {
                throw new Error(errorMessages);
            }
        }
        return result;
    }

    async function getRuleConfig() {
        const schemaJson = await getSchema();
        log(`Retrieved introspection query. Configuring validator...`);
        return [
            'error',
            {
                env: 'apollo',
                projectName: 'magento',
                schemaJson
            },
            {
                env: 'literal',
                projectName: 'magento',
                schemaJson
            }
        ];
    }

    async function getLinterConfig() {
        const ruleConfig = await getRuleConfig();
        return {
            parser: 'babel-eslint',
            rules: {
                'graphql/template-strings': ruleConfig
            },
            plugins: ['graphql'],
            useEslintrc: false
        };
    }
    // not using validEnv.isProduction here because envalid sets NODE_ENV
    // to production by default, which we do want to preserve for build opts
    const linterConfig = await getLinterConfig();
    const CLIEngine = require('eslint').CLIEngine;
    const cli = new CLIEngine(linterConfig);
    const files = cli.resolveFileGlobPatterns(['src/**/*.{js,graphql,gql}']);
    const report = cli.executeOnFiles(files);
    if (report.errorCount > 0) {
        const formatter = cli.getFormatter();
        throw new Error(`Errors found!

 ${formatter(report.results)}

  These errors may indicate:
  -  an out-of-date Magento 2.3 codebase running at "${magentoDomain}"
  -  an out-of-date project codebase whose queries need updating

Use GraphiQL or another schema exploration tool on the Magento store to learn more.
  `);
    }
}

module.exports = validateQueries;

if (module === require.main) {
    (async () => {
        try {
            await validateQueries(
                require('./validate-environment')(process.env)
            );
            console.log('All queries valid against attached GraphQL API.');
        } catch (e) {
            console.error(e.message);
            const distEnv = require('dotenv').config({
                path: require('path').resolve(__dirname, '.env.dist')
            });
            const distBackend =
                distEnv &&
                distEnv.parsed &&
                distEnv.parsed[magentoDomainVarName];
            if (distBackend && distBackend !== magentoDomain) {
                console.error(
                    `\nThe current default backend for Venia development is:\n\n\t${distBackend}\n\nThe configured ${magentoDomainVarName} in the current environment is\n\n\t${magentoDomain}\n\nConsider updating your .env file or environment variables to resolve the reported issues.`
                );
            }
            process.exit(1);
        }
    })();
}
