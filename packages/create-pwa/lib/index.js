const { basename, resolve } = require('path');
const os = require('os');
const changeCase = require('change-case');
const inquirer = require('inquirer');
const execa = require('execa');
const chalk = require('chalk');
const gitUserInfo = require('git-user-info');
const isInvalidPath = require('is-invalid-path');
const isValidNpmName = require('is-valid-npm-name');
const yargs = require('yargs');
const pkg = require('../package.json');
const {
    sampleBackends
} = require('@magento/pwa-buildpack/lib/cli/create-project');

const DEFAULT_TEMPLATE = '@magento/venia-concept';

module.exports = async () => {
    console.log(chalk.greenBright(`${pkg.name} v${pkg.version}`));

    const userAgent = process.env.npm_config_user_agent || '';
    const isYarn = userAgent.includes('yarn');

    // We want both of these to work:
    // npm init @magento/pwa from <template>
    // npm init @magento/pwa <template>
    // First, get all non-flag args (args not beginning with "-").
    const positionalArgs = yargs.argv._;
    // Find the position of the optional keyword "from".
    const wordFromIndex = positionalArgs.findIndex(arg => arg === 'from');
    // Use whatever is after "from" as the template name/
    const templateArgumentIndex = wordFromIndex + 1;
    // If there's no "from" argument, wordFromIndex will be -1, so this is 0.
    // That's how we will support `npm init @magento/pwa <template>` without
    // the "from" keyword.
    const template = positionalArgs[templateArgumentIndex] || DEFAULT_TEMPLATE;

    console.log(
        chalk.white(
            `Creating a ${chalk.whiteBright(
                'PWA Studio'
            )} project from ${chalk.whiteBright(template)}`
        )
    );

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
            name: 'npmClient',
            type: 'list',
            message: 'NPM package management client to use',
            choices: ['npm', 'yarn'],
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
    } catch (e) {
        console.error('App creation cancelled.');
    }
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
                    return [...args, answer ? `--${option}` : `--no-${option}`];
                }
                return args;
            }
            return [...args, `--${option}`, `"${answer}"`];
        },
        ['create-project', answers.directory, '--template', template]
    );

    const argsString = args.join(' ');

    console.log(
        '\nRunning command: \n\n' +
            chalk.whiteBright(`buildpack ${argsString}\n\n`)
    );

    const buildpackBinLoc = resolve(
        require.resolve('@magento/pwa-buildpack'),
        '../../bin/buildpack'
    );
    await execa.shell(`${buildpackBinLoc} ${argsString}`, {
        stdio: 'inherit'
    });
};
