const { resolve } = require('path');
const camelspace = require('camelspace');
const fse = require('fs-extra');
const prettyLogger = require('../util/pretty-logger');
const chalk = require('chalk');
const pkgDir = require('pkg-dir');
const {
    createDotEnvFile,
    createProject,
    findPackageRoot
} = require('../Utilities');
const execa = require('execa');

module.exports.sampleBackends = require('../../sampleBackends.json');

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
        .group(['template', 'backendUrl'], 'Project configuration:')
        .options({
            template: {
                describe:
                    'Name of a "template" to clone and customize. Example: `buildpack create-project --template @magento/venia-concept`'
            },
            backendUrl: {
                alias: 'b',
                describe:
                    'URL of the Magento 2.3 instance to use as a backend. Will be added to `.env` file.'
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
        template:
            (await findPackageRoot.local(argv.template)) ||
            (await findPackageRoot.remote(argv.template))
    };
    if (!params.template) {
        throw new Error(
            `Invalid template "${argv.template}". Could not find ${
                argv.template
            } locally or on the NPM registry.`
        );
    }
    const { directory, name } = params;
    await fse.ensureDir(directory);
    prettyLogger.info(`Creating a new PWA project '${name}' in ${directory}`);
    await createProject(params);

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

    fse.writeFileSync(
        resolve(directory, '.env'),
        createDotEnvFile(process.env)
    );

    if (params.install) {
        await execa.shell(`${params.npmClient} install`, {
            cwd: directory,
            stdio: 'inherit'
        });
        prettyLogger.success(`Installed dependencies for '${name}' project`);
    }
    if (process.env.NODE_ENV !== 'test' && process.env.DEBUG_PROJECT_CREATION) {
        prettyLogger.info('Debug: Removing generated tarballs');
        const monorepoDir = resolve(pkgDir.sync(__dirname), '../../');
        prettyLogger.info(
            execa.shellSync('rm -v packages/*/*.tgz', { cwd: monorepoDir })
                .stdout
        );
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
        'run build'
    )} to build the project into optimized assets in the '/dist' directory
    ${showCommand(
        'start'
    )} after build to preview the app on a local staging server.

`);
};
