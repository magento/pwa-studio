const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const firstRun = require('first-run');

const packagePath = name => path.resolve(__dirname, '..', 'packages', name);

async function prepare() {
    if (firstRun()) {
        console.warn(
            chalk.green(
                'You may see a number of warnings above about unmet peer dependencies. There is nothing wrong; this is an issue with peerDependencies and Yarn monorepos.'
            )
        );
        console.warn(
            chalk.green('The issue is being tracked at ') +
                chalk.reset.underline.bold(
                    'https://github.com/yarnpkg/yarn/issues/5810'
                ) +
                chalk.green(
                    ' and this notice will be removed when an upgrade to Yarn fixes this bug.'
                )
        );
    }
    const buildpackCli = path.resolve(
        packagePath('pwa-buildpack'),
        'bin',
        'buildpack'
    );

    const veniaPath = packagePath('venia-concept');

    console.warn(chalk.green('Preparing packages...'));
    await execa('lerna', ['--loglevel', 'warn', 'run', 'prepare'], {
        stdio: ['inherit', 'ignore', 'inherit']
    });

    console.warn(chalk.green('Ensuring valid environment...'));
    try {
        await execa(buildpackCli, ['load-env', '--core-dev-mode', veniaPath]);
    } catch (e) {
        if (e.stderr) {
            console.error(chalk.bold.red(e.stderr));
            process.exit(1);
        }
    }

    // Prep Venia custom origin
    try {
        const {
            configureHost,
            loadEnvironment
        } = require('../packages/pwa-buildpack/lib/Utilities');

        const customOrigin = loadEnvironment(veniaPath).section('customOrigin');
        if (customOrigin.enabled) {
            const customOriginConfig = await configureHost(
                Object.assign(customOrigin, {
                    dir: veniaPath,
                    interactive: false
                })
            );
            if (!customOriginConfig) {
                console.warn(
                    chalk.green(
                        'Set up a custom origin for your copy of venia-concept:\n\t'
                    ) +
                        chalk.whiteBright(
                            `yarn buildpack create-custom-origin ${veniaPath}`
                        )
                );
            }
        }
    } catch (e) {
        // environment is not even set up
    }
}

prepare().catch(e => {
    console.error(chalk.bold.red('Unexpected error setting up workspace!'), e);
    process.exit(1);
});
