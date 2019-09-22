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

const tmpDir = os.tmpdir();

const templateAliases = {
    'venia-concept': {
        npm: '@magento/venia-concept',
        dir: resolve(__dirname, '../../../venia-concept')
    }
};

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
    const template = templateAliases[templateName] || {
        npm: templateName,
        dir: templateName
    };
    try {
        await fse.readdir(template.dir);
        prettyLogger.info(`Found ${templateName} directory`);
        // if that succeeded, then...
        return template.dir;
    } catch (e) {
        return makeDirFromNpmPackage(template.npm);
    }
}

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
                    'Name of a "template" to clone and customize. Currently only the "venia-concept" template is supported: `buildpack create-project --template venia-concept`',
                choices: ['venia-concept']
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
        template: await findTemplateDir(argv.template)
    };
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

    createEnvFile({ directory });
    if (params.install) {
        await execa.shell(`${params.npmClient} install`, {
            cwd: directory,
            stdio: 'inherit'
        });
        prettyLogger.success(`Installed dependencies for '${name}' project`);
    }
    if (process.env.DEBUG_PROJECT_CREATION) {
        prettyLogger.info('Debug: Removing generated tarballs');
        const pkgDir = require('pkg-dir');
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
