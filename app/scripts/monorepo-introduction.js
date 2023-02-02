const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const firstRun = require('first-run');

const root = path.resolve(__dirname, '..');

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

    const packages = JSON.parse(
        (await execa('yarn', ['--silent', 'workspaces', 'info'], { cwd: root }))
            .stdout
    );

    const packagePath = name => path.resolve(root, packages[name].location);

    const buildpackCli = path.resolve(
        packagePath('@magento/pwa-buildpack'),
        'bin',
        'buildpack'
    );

    console.warn(chalk.green('Preparing packages...'));
    /**
     * `yarn workspaces run X` really should run only in workspaces with the
     * script 'X' defined, but it doesn't, so it fails unless every package has
     * an 'X' script. So we have to read each package.json before trying.
     */
    await Promise.all(
        Object.entries(packages).map(async ([name, { location }]) => {
            const pkg = require(`../${location}/package.json`);
            if (pkg.scripts && pkg.scripts.prepare) {
                await execa('yarn', ['workspace', name, 'run', 'prepare'], {
                    cwd: root,
                    stdio: ['inherit', 'ignore', 'inherit']
                });
            }
        })
    );

    const veniaPath = packagePath('@magento/venia-concept');

    console.warn(chalk.green('Ensuring valid environment...'));
    try {
        await execa(buildpackCli, ['load-env', '--core-dev-mode', veniaPath], {
            cwd: root
        });
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

        // loadEnvironment has already run, so let's not let it yell again
        const nullLogger = new Proxy(console, {
            get() {
                return () => {};
            }
        });
        const customOrigin = await loadEnvironment(
            veniaPath,
            nullLogger
        ).section('customOrigin');
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
