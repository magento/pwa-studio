/**
 * This plugin validates GraphQL queries against a GraphQL endpoint's schema.
 */

const fs = require('fs');
const eslint = require('eslint');

const PLUGIN_COMMAND = 'validate-queries';
const PLUGIN_DESCRIPTION =
    'Validate all query files and template literals in a project against a schema.';
const PLUGIN_SUPPORTED_ARGUMENTS = {
    clients: {
        alias: 'c',
        choices: ['apollo', 'fraql', 'literal', 'lokka', 'relay'],
        default: ['apollo'],
        describe: 'GraphQL clients in use in this project.',
        type: 'array'
    },
    filesGlob: {
        alias: 'f',
        describe: 'The glob used to target files for validation.',
        type: 'string'
    },
    project: {
        alias: 'p',
        describe: 'Project name as specified in graphql config.',
        type: 'string'
    }
};

/**
 * Validate GraphQL queries against a schema.
 */
async function validateQueries(context, argv) {
    try {
        console.log('Validating project queries...');

        const { clients, filesGlob, project } = argv;

        // Ensure the schema exists.
        context.spinner.start('Locating schema...');
        const projectConfiguration = await context.getProjectConfig();
        const { schemaPath } = projectConfiguration.config;
        const schemaExists = fs.existsSync(schemaPath);
        if (!schemaExists) {
            throw new Error(
                `Could not find a schema at ${schemaPath}.\n Run \`graphql get-schema --project ${project}\` to download the schema before running ${PLUGIN_COMMAND}.`
            );
        }
        context.spinner.succeed();

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

        process.exit(0);
    } catch (e) {
        const message = e.message ? e.message : e;
        context.spinner.fail(`An error occurred:\n${message}`);
        process.exit(1);
    }
}

/**
 * Supplies an object containing the arguments that this plugin supports.
 */
function getSupportedArguments(args) {
    return args.options(PLUGIN_SUPPORTED_ARGUMENTS);
}

/**
 * Creates a linter configuration with rules based on the current
 * clients and project. 
 */
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
    handler: validateQueries,
    supportedArguments: PLUGIN_SUPPORTED_ARGUMENTS
};
