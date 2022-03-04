/**
 * This plugin validates GraphQL queries against a GraphQL endpoint's schema.
 */

const chalk = require('chalk');
const eslint = require('eslint');
const fs = require('fs');
const semver = require('semver');
const glob = require('glob');

let compatibilityDefinitions;
try {
    // they should have been copied into this directory by the prepublish script
    compatibilityDefinitions = require('./magento-compatibility');
} catch (e) {
    // dynamically pull them from root if the project has not been built
    compatibilityDefinitions = require('../../../magento-compatibility');
}

const exitCodes = {
    SUCCESS: 0,
    FAILURE: 1
};
const DOCS_COMPAT_TABLE_PATH =
    'https://pwastudio.io/technologies/magento-compatibility/';
const plugin = {
    COMMAND: 'validate-magento-pwa-queries',
    DESCRIPTION:
        'Validate all query files and template literals in a project against a schema.',
    SUPPORTED_ARGUMENTS: {
        project: {
            alias: 'p',
            describe: 'Project name as specified in graphql config.',
            type: 'string'
        }
    }
};

/**
 * Validate GraphQL queries against a schema.
 */
async function validateQueries(context, argv) {
    try {
        const { project } = argv;

        console.log(
            `Validating GraphQL queries in ${chalk.blue(project)} project...`
        );

        const projectConfiguration = await context.getProjectConfig();
        const { extensions, schemaPath } = projectConfiguration.config;

        // Get the clients and filesGlob arguments from the .graphqlconfig.
        const configArgs = extensions[plugin.COMMAND];
        const {
            magentoBackendEdition,
            clients,
            filesGlob,
            mosFilesGlob,
            ceFilesGlob,
            acFilesGlob,
            eeFilesGlob,
            ignore
        } = configArgs;

        if (magentoBackendEdition === 'MOS' || magentoBackendEdition === 'CE') {
            ignore.push(acFilesGlob);
            ignore.push(eeFilesGlob);
        } else {
            ignore.push(mosFilesGlob);
            ignore.push(ceFilesGlob);
        }

        /**
         * List of files to run query validation on ignoring
         * files mentioned in the .graphqlconfig file.
         */
        const files = glob.sync(filesGlob, { ignore });

        // Ensure the schema exists.
        context.spinner.start('Locating schema...');
        const schemaExists = fs.existsSync(schemaPath);
        if (!schemaExists) {
            throw new Error(
                `Could not find a schema at ${schemaPath}.\n Run \`graphql get-schema --project ${project}\` to download the schema before running ${
                    plugin.COMMAND
                }.`
            );
        }
        context.spinner.succeed();

        // Validate our queries against that schema.
        context.spinner.start('Finding queries in files...');
        const validator = getValidator({ clients, project, schemaPath });
        const queryFiles = validator.resolveFileGlobPatterns(files);
        context.spinner.succeed(
            `Found ${queryFiles.length} files to test in ${filesGlob}`
        );

        context.spinner.start('Validating queries against the schema...');
        const report = validator.executeOnFiles(queryFiles);
        context.spinner.succeed();

        // Intentionally insert a blank line to the console for readability.
        console.log();

        // Report the results.
        if (report.errorCount === 0 && report.warningCount === 0) {
            console.log(chalk.green('All queries are valid.'));

            process.exit(exitCodes.SUCCESS);
        } else {
            console.warn(chalk.red('Found some potential issues:'));

            const formatter = validator.getFormatter();
            console.log(formatter(report.results));

            console.log(getErrorResolutionDetails());

            if (report.errorCount) {
                process.exit(exitCodes.FAILURE);
            } else {
                process.exit(exitCodes.SUCCESS);
            }
        }
    } catch (e) {
        const message = e.message ? e.message : e;
        context.spinner.fail(`An error occurred:\n${message}`);

        process.exit(exitCodes.FAILURE);
    }
}

/**
 * Supplies an object containing the arguments that this plugin supports.
 */
function getSupportedArguments(args) {
    return args.options(plugin.SUPPORTED_ARGUMENTS);
}

/**
 * Creates a linter configuration with rules based on the current
 * clients and project.
 */
function getValidator({ clients, project, schemaPath }) {
    const clientRules = clients.map(clientName => ({
        env: clientName,
        projectName: project,
        schemaJsonFilepath: schemaPath
    }));

    const error = ['error', ...clientRules];
    const warn = ['warn', ...clientRules];

    /*
     * Here we explicitly list the validators for the graphql/template-strings rule to use.
     *
     * We'd like to use the special value 'all' but we have to disable some validators due
     * to how PWA Studio uses GraphQL.
     *
     * @see https://github.com/apollographql/eslint-plugin-graphql#selecting-validation-rules
     */
    const validators = [
        'ExecutableDefinitions',
        'FieldsOnCorrectType',
        'FragmentsOnCompositeTypes',
        'KnownArgumentNames',
        'KnownDirectives',
        /*
         * PWA Studio sometimes uses fragments imported from other JS files.
         * The parser does not recognize these.
         */
        // 'KnownFragmentNames',
        'KnownTypeNames',
        'LoneAnonymousOperation',
        'NoFragmentCycles',
        'NoUndefinedVariables',
        /*
         * PWA Studio sometimes defines fragments for use by other JS files.
         */
        // 'NoUnusedFragments',
        'NoUnusedVariables',
        'OverlappingFieldsCanBeMerged',
        'PossibleFragmentSpreads',
        'ProvidedRequiredArguments',
        'ScalarLeafs',
        'SingleFieldSubscriptions',
        'UniqueArgumentNames',
        'UniqueDirectivesPerLocation',
        'UniqueFragmentNames',
        'UniqueInputFieldNames',
        'UniqueOperationNames',
        'UniqueVariableNames',
        'ValuesOfCorrectType',
        'VariablesAreInputTypes',
        /*
         * The eslint-plugin-graphql docs may be out of date,
         * this doesn't appear to be a legitimate validator anymore.
         */
        // 'VariablesDefaultValueAllowed',
        'VariablesInAllowedPosition'
    ];

    const linterConfiguration = {
        parser: 'babel-eslint',
        plugins: ['graphql'],
        rules: {
            'graphql/capitalized-type-name': error,
            'graphql/named-operations': error,
            'graphql/no-deprecated-fields': warn,
            'graphql/required-fields': [
                'error',
                ...clientRules.map(rule => ({
                    ...rule,
                    requiredFields: ['id']
                }))
            ],
            'graphql/template-strings': [
                'error',
                ...clientRules.map(rule => ({
                    ...rule,
                    validators
                }))
            ]
        },
        useEslintrc: false
    };

    return new eslint.CLIEngine(linterConfiguration);
}

/**
 * Returns a string that contains more specific information for the developer
 * on their project version and how to resolve version incompatibility conflicts.
 */
function getErrorResolutionDetails() {
    let versionSpecificDetails = '';

    const packageVersion = process.env.npm_package_version;
    if (packageVersion) {
        versionSpecificDetails = `This Venia store is from PWA Studio version ${chalk.green(
            packageVersion
        )}.`;

        // Attempt to figure out the Magento version(s) that match this PWA version.
        const allPWAVersions = Object.keys(compatibilityDefinitions);
        const pwaMatch = allPWAVersions.find(pwaVersion => {
            return semver.satisfies(packageVersion, pwaVersion);
        });
        if (pwaMatch) {
            const compatibleMagentoVersion = compatibilityDefinitions[pwaMatch];
            versionSpecificDetails += `\nSome components in PWA Studio version ${chalk.green(
                packageVersion
            )} send GraphQL queries that are only compatible with version ${chalk.underline(
                chalk.red(compatibleMagentoVersion)
            )} of Magento 2.`;
        }
    }

    return `${chalk.red(
        `Your versions of PWA and Magento may be incompatible.`
    )}

${versionSpecificDetails}

Please refer to the compatibility table in the PWA documentation for more details: ${chalk.blue(
        chalk.underline(DOCS_COMPAT_TABLE_PATH)
    )}.
    `;
}

module.exports = {
    builder: getSupportedArguments,
    command: plugin.COMMAND,
    desc: plugin.DESCRIPTION,
    handler: validateQueries,
    supportedArguments: plugin.SUPPORTED_ARGUMENTS
};
