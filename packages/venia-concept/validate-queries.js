require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const magentoDomainVarName = 'MAGENTO_BACKEND_DOMAIN';
const magentoDomain = process.env[magentoDomainVarName];
if (!magentoDomain) {
    console.error(
        `No ${magentoDomainVarName} environment variable specified. Have you created a .env file?`
    );
    process.exit(1);
}

const { URL } = require('url');
let uri;
try {
    uri = new URL('/graphql', magentoDomain);
} catch (e) {
    console.error(
        `Could not build a GraphQL endpoint URL from env var ${magentoDomainVarName}: '${magentoDomain}'.`
    );
    process.exit(1);
}

const { gql, HttpLink, makePromise, execute } = require('apollo-boost');
const { getIntrospectionQuery, introspectionQuery } = require('graphql');

const query = gql(
    getIntrospectionQuery ? getIntrospectionQuery() : introspectionQuery
);

const link = new HttpLink({ uri, fetch: require('node-fetch') });

async function getSchema() {
    console.log(`Validating queries based on schema at ${uri.href}...`);
    return makePromise(execute(link, { query }));
}

async function getRuleConfig() {
    const schemaJson = await getSchema();
    console.log(`Retrieved introspection query. Configuring validator...`);
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
    console.log(`Validator configured. Running validator...`);
    return {
        parser: 'babel-eslint',
        rules: {
            'graphql/template-strings': ruleConfig
        },
        plugins: ['graphql'],
        useEslintrc: false
    };
}

async function validateQueries() {
    const linterConfig = await getLinterConfig();
    const CLIEngine = require('eslint').CLIEngine;
    const cli = new CLIEngine(linterConfig);
    const files = cli.resolveFileGlobPatterns(['src/**/*.{js,graphql,gql}']);
    const report = cli.executeOnFiles(files);
    if (report.errorCount > 0) {
        console.error(`Errors found!`);
        const formatter = cli.getFormatter();
        process.stderr.write(formatter(report.results));
        console.error(
            `
These errors may indicate:
  -  an out-of-date Magento 2.3 codebase running at "${magentoDomain}"
  -  an out-of-date project codebase whose queries need updating

Use GraphiQL or another schema exploration tool on the Magento store to learn more.
  `
        );
        process.exit(1);
    } else {
        console.log(
            `Validation passed! All queries found are valid for schema.`
        );
        process.exit(0);
    }
}

validateQueries();
