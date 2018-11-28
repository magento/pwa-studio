process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const { URL } = require('url');
const magentoUrlEnvName = 'MAGENTO_BACKEND_URL';
let magentoBackendUrl;

async function validateQueries(validEnv, log = console.log.bind(console)) {
    if (process.env.NODE_ENV === 'production') {
        log(`NODE_ENV=production, skipping query validation`);
        return false;
    }
    magentoBackendUrl = validEnv[magentoUrlEnvName];

    let graphQLEndpoint;
    try {
        magentoBackendUrl = new URL(magentoBackendUrl);
        graphQLEndpoint = new URL('/graphql', magentoBackendUrl);
    } catch (e) {
        throw new Error(
            `Could not build a GraphQL endpoint URL from env var ${magentoUrlEnvName}: '${magentoBackendUrl}'. ${
                e.message
            }`
        );
    }

    const { gql, HttpLink, makePromise, execute } = require('apollo-boost');
    const { getIntrospectionQuery, introspectionQuery } = require('graphql');

    const query = gql(
        getIntrospectionQuery ? getIntrospectionQuery() : introspectionQuery
    );

    const link = new HttpLink({
        uri: graphQLEndpoint,
        fetch: require('node-fetch')
    });

    async function getSchema() {
        log(`Validating queries based on schema at ${graphQLEndpoint.href}...`);
        const result = await makePromise(execute(link, { query }));
        if (result.errors) {
            const errorMessages = `The introspection query to ${
                graphQLEndpoint.href
            } failed with the following errors:\n\t- ${result.errors
                .map(({ message }) => message)
                .join('\n\t- ')}`;
            if (
                errorMessages.includes('GraphQL introspection is not allowed')
            ) {
                throw new Error(
                    `Cannot validate queries because the configured Magento backend ${
                        magentoBackendUrl.href
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
  -  an out-of-date Magento 2.3 codebase running at "${magentoBackendUrl}"
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
            try {
                console.error(e.message);
                const distEnv = require('dotenv').config({
                    path: require('path').resolve(__dirname, '.env.dist')
                });
                const distBackend = new URL(distEnv.parsed[magentoUrlEnvName]);

                if (distBackend.href !== magentoBackendUrl.href) {
                    console.error(
                        `\nThe current default backend for Venia development is:\n\n\t${
                            distBackend.href
                        }\n\nThe configured ${magentoUrlEnvName} in the current environment is\n\n\t${
                            magentoBackendUrl.href
                        }\n\nConsider updating your .env file or environment variables to resolve the reported issues.`
                    );
                }
            } finally {
                process.exit(1);
            }
        }
    })();
}
