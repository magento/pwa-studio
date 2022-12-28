const { resolve } = require('path');
const fetch = require('node-fetch');
const os = require('os');
const tar = require('tar');
const camelspace = require('camelspace');
const fse = require('fs-extra');
const prettyLogger = require('../util/pretty-logger');
const chalk = require('chalk');
const createProject = require('../Utilities/createProject');
const { handler: createEnvFile } = require('./create-env-file');
const execa = require('execa');
const sampleBackends = require('../../sampleBackends.json');

const tmpDir = os.tmpdir();

async function makeDirFromNpmPackage(packageName) {
    const packageDir = resolve(tmpDir, packageName);
    // NPM extracts a tarball to './package'
    const packageRoot = resolve(packageDir, 'package');
    try {
        if ((await fse.readdir(packageRoot)).includes('package.json')) {
            prettyLogger.info(`Found ${packageName} template in cache`);
            return packageRoot;
        }
    } catch (e) {
        // Not cached.
    }
    let tarballUrl;
    try {
        prettyLogger.info(`Finding ${packageName} tarball on NPM`);
        tarballUrl = JSON.parse(
            execa.shellSync(`npm view --json ${packageName}`, {
                encoding: 'utf-8'
            }).stdout
        ).dist.tarball;
    } catch (e) {
        throw new Error(
            `Invalid template: could not get tarball url from npm: ${e.message}`
        );
    }

    let tarballStream;
    try {
        prettyLogger.info(`Downloading and unpacking ${tarballUrl}`);
        tarballStream = (await fetch(tarballUrl)).body;
    } catch (e) {
        throw new Error(
            `Invalid template: could not download tarball from NPM: ${
                e.message
            }`
        );
    }

    await fse.ensureDir(packageDir);
    return new Promise((res, rej) => {
        const untarStream = tar.extract({
            cwd: packageDir
        });
        tarballStream.pipe(untarStream);
        untarStream.on('finish', () => {
            prettyLogger.info(`Unpacked ${packageName}`);
            res(packageRoot);
        });
        untarStream.on('error', rej);
        tarballStream.on('error', rej);
    });
}

async function findTemplateDir(templateName) {
    try {
        await fse.readdir(templateName);
        prettyLogger.info(`Found ${templateName} directory`);
        // if that succeeded, then...
        return templateName;
    } catch (e) {
        return makeDirFromNpmPackage(templateName);
    }
}

module.exports.sampleBackends = sampleBackends;

module.exports.command = 'create-project <directory>';

module.exports.describe =
    'Create a PWA project in <directory> based on template.';

module.exports.builder = yargs =>
    yargs
        .version()
        .showHelpOnFail(false)
        .positional('directory', {
            describe:
                'Name or path to a directory to create and fill with the project files. This directory will be the project root.',
            normalize: true
        })
        .group(
            ['template', 'backendUrl', 'backendEdition', 'braintreeToken'],
            'Project configuration:'
        )
        .options({
            template: {
                describe:
                    'Name of a "template" to clone and customize. Currently only the "@magento/venia-concept" template is supported. Version labels are supported. For instance: @magento/venia-concept@8.0.0'
            },
            backendUrl: {
                alias: 'b',
                describe:
                    'URL of the Magento 2.3 instance to use as a backend. Will be added to `.env` file.'
            },
            backendEdition: {
                describe:
                    'Edition of the magento store (Adobe Commerce or Magento Open Source)'
            },
            braintreeToken: {
                describe:
                    'Braintree API token to use to communicate with your Braintree instance. Will be added to `.env` file.'
            }
        })
        .group(['name', 'author'], 'Metadata:')
        .options({
            name: {
                alias: 'n',
                describe:
                    'Short name of the project to put in the package.json "name" field. Uses <directory> by default.'
            },
            author: {
                alias: 'a',
                describe:
                    'Name and (optionally <email address>) of the author to put in the package.json "author" field.'
            }
        })
        .group(['install', 'npmClient'], 'Package management:')
        .options({
            install: {
                boolean: true,
                describe: 'Install package dependencies after creating project',
                default: true
            },
            npmClient: {
                describe: 'NPM package management client to use.',
                choices: ['npm', 'yarn'],
                default: 'npm'
            }
        })
        .help();

module.exports.handler = async function buildpackCli(argv) {
    const params = {
        ...argv,
        name: argv.name || argv.directory,
        template: await findTemplateDir(argv.template)
    };
    const { directory, name } = params;
    await fse.ensureDir(directory);

    // Create the new PWA project.
    prettyLogger.info(`Creating a new PWA project '${name}' in ${directory}`);
    await createProject(params);

    // Update process.env with backendUrl, backendEdition and braintreeToken
    // vars if necessary.
    if (params.backendUrl) {
        const magentoNS = camelspace('magento');
        const { backendUrl } = magentoNS.fromEnv(process.env);
        if (backendUrl && backendUrl !== params.backendUrl) {
            prettyLogger.warn(
                `Command line option --backend-url was set to '${
                    params.backendUrl
                }', but environment variable ${JSON.stringify(
                    magentoNS.toEnv({ backendUrl })
                )} conflicts with it. Environment variable overrides!`
            );
        } else {
            Object.assign(
                process.env,
                magentoNS.toEnv({ backendUrl: params.backendUrl })
            );
        }
    }

    if (params.backendEdition) {
        const magentoNS = camelspace('magento');
        const { backendEdition } = magentoNS.fromEnv(process.env);
        if (backendEdition && backendEdition !== params.backendEdition) {
            prettyLogger.warn(
                `Command line option --backend-edition was set to '${
                    params.backendEdition
                }', but environment variable ${JSON.stringify(
                    magentoNS.toEnv({ backendEdition })
                )} conflicts with it. Environment variable overrides!`
            );
        } else {
            Object.assign(
                process.env,
                magentoNS.toEnv({ backendEdition: params.backendEdition })
            );
        }
    }

    if (params.braintreeToken) {
        // Corresponds to the CHECKOUT section in envVarDefinitions.json.
        const checkoutNS = camelspace('checkout');
        const { braintreeToken } = checkoutNS.fromEnv(process.env);
        if (braintreeToken && braintreeToken !== params.braintreeToken) {
            // The user has CHECKOUT_BRAINTREE_TOKEN already set in their .env
            // and it doesn't match the command line arg.
            prettyLogger.warn(
                `Command line option --braintree-token was set to '${
                    params.braintreeToken
                }', but environment variable ${JSON.stringify(
                    checkoutNS.toEnv({ braintreeToken })
                )} conflicts with it. Environment variable overrides!`
            );
        } else {
            // The user doesn't have CHECKOUT_BRAINTREE_TOKEN set in their .env
            // or they do but it matches the command line arg.
            Object.assign(
                process.env,
                checkoutNS.toEnv({ braintreeToken: params.braintreeToken })
            );
        }
    }

    // Create the .env file for the new project.
    createEnvFile({ directory });

    // Install the project if instructed to do so.
    if (params.install) {
        await execa.shell(`${params.npmClient} install`, {
            cwd: directory,
            stdio: 'inherit'
        });
        prettyLogger.success(`Installed dependencies for '${name}' project`);
    }

    const showCommand = command =>
        ' - ' + chalk.whiteBright(`${params.npmClient} ${command}`);
    const buildpackPrefix = params.npmClient === 'npm' ? ' --' : '';
    const customOriginCommand = `run buildpack${buildpackPrefix} create-custom-origin .`;
    const prerequisites = [];
    if (process.cwd() !== resolve(directory)) {
        prerequisites.push(`cd ${directory}`);
    }
    if (!params.install) {
        prerequisites.push(`${params.npmClient} install`);
    }
    const prerequisiteCommand = prerequisites.join(' && ');
    const prerequisiteNotice =
        prerequisiteCommand.length > 0
            ? `- ${chalk.whiteBright(
                  prerequisiteCommand
              )} before running the below commands.`
            : '';
    prettyLogger.warn(`Created new PWA project ${params.name}. Next steps:
    ${prerequisiteNotice}
    ${showCommand(
        customOriginCommand
    )} to generate a unique, secure custom domain for your new project. ${chalk.greenBright(
        'Highly recommended.'
    )}
    ${showCommand(
        'run watch'
    )} to start the dev server and do real-time development.
    ${showCommand(
        'run storybook'
    )} to start Storybook dev server and view available components in your app.
    ${showCommand(
        'run build'
    )} to build the project into optimized assets in the '/dist' directory.
    ${showCommand(
        'start'
    )} after build to preview the app on a local staging server.

`);
};
