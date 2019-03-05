const { getGraphQLProjectConfig } = require('graphql-config');

const { request } = require('graphql-request');
const { getIntrospectionQuery, introspectionQuery } = require('graphql');

const query = getIntrospectionQuery
    ? getIntrospectionQuery()
    : introspectionQuery;

module.exports.command = 'validate-queries';
module.exports.describe =
    'Validate all query files and template literals in a project against the schema';

module.exports.builder = args =>
    args.options({
        clients: {
            alias: 'c',
            choices: ['apollo', 'fraql', 'literal', 'lokka', 'relay'],
            default: ['apollo'],
            describe: 'GraphQL clients in use in this project.',
            type: 'array'
        },
        directory: {
            alias: 'd',
            default: './src/',
            describe:
                'Path to directory that contains all GraphQL files and tags to be validated',
            type: 'string'
        },
        insecure: {
            alias: 'i',
            describe: 'Allow insecure (self-signed) certificates',
            type: 'boolean'
        },
        project: {
            alias: 'p',
            describe: 'Project name',
            type: 'string'
        }
    });

module.exports.handler = async (context, argv) => {
    if (argv.insecure) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    const config = context.getProjectConfig(null, argv.project);
    let schema;
    try {
        schema = config.getSchema();
    } catch (e) {
        let endpoint;
        try {
            endpoint = cfg.extensions.endpoints.default;
        } catch (e) {
            throw new Error(
                `GraphQLConfig file at "${
                    cfg.configPath
                }" must include the GraphQL endpoint of a running Magento instance at extensions: { endpoints: { default } }`
            );
        }
        console.warn(
            `Valid schema not found at "${
                config.schemaPath
            }". Retrieving from extensions.endpoints.default: ${endpoint}`
        );
    }
};

function getRuleConfig(argv) {}
