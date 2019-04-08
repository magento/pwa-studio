const { basename, resolve } = require('path');
const os = require('os');
const changeCase = require('change-case');
const inquirer = require('inquirer');
const execa = require('execa');
const chalk = require('chalk');
const gitUserInfo = require('git-user-info');
const isInvalidPath = require('is-invalid-path');
const isValidNpmName = require('is-valid-npm-name');
const pkg = require('./package.json');
const {
    sampleBackends
} = require('@magento/pwa-buildpack/dist/cli/init-project');

module.exports = async () => {
    console.log(chalk.greenBright(pkg.name + `version ${pkg.version}`));
    console.log(
        chalk.white(`Creating a ${chalk.whiteBright('venia-starter')} project`)
    );
    const userAgent = process.env.npm_config_user_agent || '';
    const isYarn = userAgent.includes('yarn');

    const questions = [
        {
            name: 'directory',
            message:
                'Project root directory (will be created if it does not exist)',
            validate: dir =>
                isInvalidPath(dir)
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
                    author = gitInfo.name;
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
                'Sample Magento 2.3 instance to use as a backend (will be added to `.env` file)',
            choices: sampleBackends.environments
                .map(({ name, description, url }) => ({
                    name: description,
                    value: url,
                    short: name
                }))
                .concat([
                    {
                        name:
                            'Other (I will provide my own backing Magento 2.3.1 instance)',
                        value: false,
                        short: 'Other'
                    }
                ])
        },
        {
            name: 'customBackendUrl',
            message:
                'URL of a Magento 2.3 instance to use as a backend (will be added to `.env` file)',
            default: 'https://magento2.localhost',
            when: ({ backendUrl }) => !backendUrl
        },
        {
            name: 'customOrigin',
            message:
                'Create a custom secure host and certificate for this project (requires administrator privileges)',
            type: 'confirm',
            default: true
        },
        {
            name: 'npmClient',
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
            if (q.name === 'customBackendUrl') {
                return args;
            }
            const answer = answers[q.name];
            if (q.name === 'directory') {
                return [...args, answer];
            }
            const option = changeCase.paramCase(q.name);
            if (q.type === 'confirm') {
                if (answer !== q.default) {
                    return [...args, answer ? `--${option}` : `--no-${option}`];
                }
                return args;
            }
            return [...args, `--${option}`, `"${answer}"`];
        },
        ['init-project', 'venia-starter']
    );
    console.log(
        chalk.white(
            `Running ${chalk.whiteBright('buildpack ' + args.join(' '))}`
        )
    );
    execa('buildpack', args, {
        stdio: 'inherit'
    });
};
