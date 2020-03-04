const execa = require('execa');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const figures = require('figures');

const { promisify } = require('util');
const _fs = require('fs');
const fs = {
    readdir: promisify(_fs.readdir),
    readFile: promisify(_fs.readFile),
    mkdir: promisify(_fs.mkdir),
    writeFile: promisify(_fs.writeFile)
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function run() {
    const prototypePackages = {
        base: path.resolve(__dirname, '../'),
        node: path.resolve(__dirname, '../packages/pwa-buildpack'),
        react: path.resolve(__dirname, '../packages/peregrine')
    };

    const getPackageFile = async dir =>
        JSON.parse(
            await fs.readFile(path.resolve(dir, 'package.json'), 'utf8')
        );

    const packageFiles = {
        base: await getPackageFile(prototypePackages.base),
        node: await getPackageFile(prototypePackages.node),
        react: await getPackageFile(prototypePackages.react)
    };

    const basePkg = () => ({
        version: '0.0.1',
        publishConfig: {
            access: 'public'
        },
        main: 'lib/index.js',
        scripts: {
            clean: ' '
        },
        repository: packageFiles.base.repository,
        author: packageFiles.base.author,
        license: packageFiles.base.license,
        bugs: packageFiles.base.bugs,
        homepage: packageFiles.base.homepage,
        devDependencies: {
            '@magento/eslint-config':
                packageFiles.base.devDependencies['@magento/eslint-config']
        },
        'pwa-studio': {
            targets: {}
        },
        engines: {
            node: packageFiles.base.engines.node
        }
    });

    const packageTemplate = {
        node(props) {
            return Object.assign(basePkg(), props);
        },
        react(props) {
            return Object.assign(
                basePkg(),
                {
                    peerDependencies: {
                        '@magento/babel-preset-peregrine':
                            packageFiles.react.peerDependencies[
                                '@magento/babel-preset-peregrine'
                            ],
                        react: packageFiles.base.resolutions.react
                    },
                    module: 'lib/index.js',
                    'jsnext:main': 'lib/index.js',
                    es2015: 'lib/index.js',
                    sideEffects: false
                },
                props
            );
        }
    };

    const ask = (question, validate = x => x.length === 0 && 'Required') =>
        new Promise(function asker(res, rej) {
            try {
                rl.question(`${figures.arrowRight} ${question}`, ans => {
                    const answer = ans.trim();
                    const validation = validate(answer);
                    if (typeof validation === 'string') {
                        console.error(
                            chalk.redBright(`${figures.cross} ${validation}`)
                        );
                        asker(res, rej);
                    } else {
                        res(answer);
                    }
                });
            } catch (e) {
                rej(e);
            }
        });

    console.log(
        chalk.greenBright(
            `\n${
                figures.smiley
            } Congratulations on your decision to add new functionality to PWA Studio the ${chalk.bold(
                'Right Way™'
            )}: with a new, separate module.\n`
        )
    );

    const dir = await ask(
        `Project name? ${chalk.yellowBright('@magento/')}`,
        answer =>
            /^[a-z][a-z0-9\-]*$/.test(answer) ||
            'Bad package name. Package names must be lowercased, dash-separated alphanumeric.'
    );
    const packagePath = path.resolve(__dirname, '../packages', dir);

    let ls;
    try {
        ls = await fs.readdir(packagePath);
    } catch (e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
    }
    if (ls) {
        throw new Error(`Directory ${packagePath} already exists!`);
    }

    const packageType = await ask(
        `Package type? ${chalk.yellowBright('node')} or ${chalk.yellowBright(
            'react'
        )} `,
        answer =>
            answer === 'node' ||
            answer === 'react' ||
            'Must be "node" or "react"'
    );

    const projectName = await ask(`Project friendly name for test labeling? `);

    const description = await ask('Package description? ');

    const files = Object.entries({
        'package.json': JSON.stringify(
            packageTemplate[packageType]({
                name: `@magento/${dir}`,
                description
            }),
            null,
            2
        ),
        '.npmignore': `.eslintrc.js
/lib/**/__{docs,helpers,mocks,tests}__/**
`,
        '.eslintrc.js': await fs.readFile(
            path.resolve(prototypePackages[packageType], '.eslintrc.js'),
            'utf8'
        ),
        'README.md': `Documentation for Magento PWA Studio packages is located at [https://pwastudio.io](https://pwastudio.io).
`
    });

    packageFiles.base.workspaces.jestProjectConfig[packageType][
        dir
    ] = projectName;

    await ask(
        chalk.yellowBright(`\n${figures.warning} OK to do the following?
    - Update root package.json jestProjectConfig
    - Create the following files:
      ${files.map(([file]) => `packages/${dir}/${file}`).join('\n      ')}

    Press enter to confirm, Ctrl-C to cancel`),
        () => true
    );

    console.log('Writing root package.json');
    await fs.writeFile(
        path.resolve(prototypePackages.base, 'package.json'),
        JSON.stringify(packageFiles.base, null, 2)
    );
    await fs.mkdir(packagePath);
    await Promise.all(
        files.map(([name, contents]) =>
            fs.writeFile(path.resolve(packagePath, name), contents, 'utf8')
        )
    );

    rl.close();
    console.log('Formatting files...');
    await execa(`eslint`, [`packages/${dir}/{*.js,package.json}`, '--fix'], {
        cwd: path.resolve(__dirname, '../')
    });

    console.log(
        `${chalk.greenBright(
            figures.tick + ' Done!'
        )} Enjoy your new project, ${chalk.yellowBright('@magento/' + dir)}.`
    );
}

run().catch(e => {
    rl.close();
    console.error(e);
    process.exit(1);
});
