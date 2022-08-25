const { basename, resolve } = require('path');
const os = require('os');
const fetch = require('node-fetch');
const changeCase = require('change-case');
const inquirer = require('inquirer');
const execa = require('execa');
const chalk = require('chalk');
const gitUserInfo = require('git-user-info');
const isInvalidPath = require('is-invalid-path');
const isValidNpmName = require('is-valid-npm-name');
const pkg = require('../package.json');
const defaultSampleBackends = require('@magento/pwa-buildpack/sampleBackends.json');

const uniqBy = (array, property) => {
    const map = new Map();

    for (const element of array) {
        if (element && element.hasOwnProperty(property)) {
            map.set(element[property], element);
        }
    }

    return Array.from(map.values());
};

const removeDuplicateBackends = backendEnvironments =>
    uniqBy(backendEnvironments, 'url');

const fetchSampleBackends = async () => {
    try {
        const res = await fetch(
            'https://fvp0esmt8f.execute-api.us-east-1.amazonaws.com/default/getSampleBackends'
        );
        const { sampleBackends } = await res.json();

        return sampleBackends.environments;
    } catch {
        return [];
    }
};

module.exports = async () => {
    console.log(chalk.greenBright(`${pkg.name} v${pkg.version}`));
    console.log(
        chalk.white(`Creating a ${chalk.whiteBright('PWA Studio')} project`)
    );
    const userAgent = process.env.npm_config_user_agent || '';
    const isYarn = userAgent.includes('yarn');

    const sampleBackendEnvironments = await fetchSampleBackends();
    const filteredBackendEnvironments = removeDuplicateBackends([
        ...sampleBackendEnvironments,
        ...defaultSampleBackends.environments
    ]);
    const sampleBackends = {
        ...defaultSampleBackends,
        environments: filteredBackendEnvironments
    };

    const questions = [
        {
            name: 'directory',
            message:
                'Project root directory (will be created if it does not exist)',
            validate: dir =>
                !dir
                    ? 'Please enter a directory path'
                    : isInvalidPath(dir)
                    ? 'Invalid directory path; contains illegal characters'
                    : true
        },
        {
            name: 'name',
            message:
                'Short name of the project to put in the package.json "name" field',
            validate: isValidNpmName,
            default: ({ directory }) => basename(directory)
        },
        {
            name: 'author',
            message:
                'Name of the author to put in the package.json "author" field',
            default: () => {
                const userInfo = os.userInfo();
                let author = userInfo.username;
                const gitInfo = gitUserInfo({
                    path: resolve(userInfo.homedir, '.gitconfig')
                });

                if (gitInfo) {
                    author = gitInfo.name || author;
                    if (gitInfo.email) {
                        author += ` <${gitInfo.email}>`;
                    }
                }
                return author;
            }
        },
        {
            name: 'template',
            message: ({ name }) =>
                `Which template would you like to use to bootstrap ${name}? Defaults to "@magento/venia-concept".`,
            default: '@magento/venia-concept'
        },
        {
            name: 'backendUrl',
            type: 'list',
            message:
                'Magento instance to use as a backend (will be added to `.env` file)',
            choices: sampleBackends.environments
                .map(({ name, description, url }) => ({
                    name: description,
                    value: url,
                    short: name
                }))
                .concat([
                    {
                        name:
                            'Other (I will provide my own backing Magento instance)',
                        value: false,
                        short: 'Other'
                    }
                ])
        },
        {
            name: 'customBackendUrl',
            message:
                'URL of a Magento instance to use as a backend (will be added to `.env` file)',
            default: 'https://magento2.localhost',
            when: ({ backendUrl }) => !backendUrl
        },
        {
            name: 'backendEdition',
            type: 'list',
            message:
                'Edition of the magento store (Adobe Commerce or Magento Open Source)',
            choices: ['AC', 'EE', 'MOS', 'CE'],
            default: 'AC'
        },
        {
            name: 'braintreeToken',
            message:
                'Braintree API token to use to communicate with your Braintree instance (will be added to `.env` file)',
            default: 'sandbox_8yrzsvtm_s2bg8fs563crhqzk'
        },
        {
            name: 'npmClient',
            type: 'list',
            message: 'NPM package management client to use',
            choices: ['yarn', 'npm'],
            default: isYarn ? 'yarn' : 'npm'
        },
        {
            name: 'install',
            type: 'confirm',
            message: ({ npmClient }) =>
                `Install package dependencies with ${npmClient} after creating project`,
            default: true
        }
    ];
    let answers;
    try {
        answers = await inquirer.prompt(questions);

        answers.backendUrl = answers.backendUrl || answers.customBackendUrl;
        const args = questions.reduce(
            (args, q) => {
                if (q.name === 'customBackendUrl' || q.name === 'directory') {
                    return args;
                }
                const answer = answers[q.name];
                const option = changeCase.paramCase(q.name);
                if (q.type === 'confirm') {
                    if (answer !== q.default) {
                        return [
                            ...args,
                            answer ? `--${option}` : `--no-${option}`
                        ];
                    }
                    return args;
                }
                return [...args, `--${option}`, `"${answer}"`];
            },
            ['create-project', answers.directory]
        );

        const argsString = args.join(' ');

        console.log(
            '\nRunning command: \n\n' +
                chalk.whiteBright(`buildpack ${argsString}\n\n`)
        );

        const buildpackBinLoc = resolve(
            require.resolve('@magento/pwa-buildpack'),
            '../../bin/buildpack'
        ).replace(/([ '"])/g, '\\$1');
        await execa.shell(`${buildpackBinLoc} ${argsString}`, {
            stdio: 'inherit'
        });
    } catch (e) {
        console.error('App creation cancelled.');
    }
};
