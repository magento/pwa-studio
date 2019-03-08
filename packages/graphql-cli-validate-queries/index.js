/**
 * This plugin validates GraphQL queries against a GraphQL endpoint's schema.
 * TODO: make this unit testable.
 */

const eslint = require('eslint');

const PLUGIN_COMMAND = 'validate-queries';
const PLUGIN_DESCRIPTION =
    'Validate all query files and template literals in a project against a schema.';

/**
 * TODO
 * @param {*} context
 * @param {*} argv
 */
async function validateQueries(context, argv) {
    try {
        console.log('Validating project queries...');

        const { clients, filesGlob, insecure, project } = argv;

        if (insecure) {
            console.log('Allowing insecure (self-signed) certificates.');
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }

        // Validate our queries against that schema.
        context.spinner.start('Finding queries in files...');
        const validator = getValidator({ clients, project });
        const queryFiles = validator.resolveFileGlobPatterns([filesGlob]);
        context.spinner.succeed();

        context.spinner.start(
            "Validating project's queries against the schema..."
        );
        const report = validator.executeOnFiles(queryFiles);
        context.spinner.succeed();

        console.log(`Checked ${report.results.length} files.`);

        // Report the results.
        if (report.errorCount === 0) {
            console.log('All queries are valid.');
        } else {
            console.warn('Found some invalid queries:');

            const formatter = validator.getFormatter();
            console.log(formatter(report.results));
        }
    } catch (e) {
        const message = e.message ? e.message : e;
        context.spinner.fail(`An error occurred: ${message}`);
    }
}

/**
 *
 * @param {*} args
 */
function getSupportedArguments(args) {
    const supportedArguments = {
        clients: {
            alias: 'c',
            choices: ['apollo', 'fraql', 'literal', 'lokka', 'relay'],
            default: ['apollo'],
            describe: 'GraphQL clients in use in this project.',
            type: 'array'
        },
        filesGlob: {
            alias: 'f',
            describe: 'The glob used to target files for validation',
            type: 'string'
        },
        insecure: {
            alias: 'i',
            describe: 'Allow insecure (self-signed) certificates',
            type: 'boolean'
        },
        project: {
            alias: 'p',
            describe: 'Project name as specified in graphql config',
            type: 'string'
        }
    };

    return args.options(supportedArguments);
}

function getValidator({ clients, project }) {
    const clientRules = clients.map(clientName => ({
        env: clientName,
        projectName: project
    }));

    const ruleDefinition = ['error', ...clientRules];

    const linterConfiguration = {
        parser: 'babel-eslint',
        plugins: ['graphql'],
        rules: {
            'graphql/template-strings': ruleDefinition,
            'graphql/no-deprecated-fields': ruleDefinition
        },
        useEslintrc: false
    };

    return new eslint.CLIEngine(linterConfiguration);
}

module.exports = {
    builder: getSupportedArguments,
    command: PLUGIN_COMMAND,
    desc: PLUGIN_DESCRIPTION,
    handler: validateQueries
};
