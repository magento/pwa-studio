const chalk = require('chalk');
const firstRun = require('first-run');
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

    for (const [name, value] of Object.entries(process.env)) {
        if (name.toLowerCase().includes('cache')) {
            console.log(chalk.green(name), value);
        }
    }
}
