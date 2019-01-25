require('events').EventEmitter.defaultMaxListeners = 100;

const chalk = require('chalk');
const chokidar = require('chokidar');
const execa = require('execa');
const figures = require('figures');
const keypress = require('keypress');
const debounce = require('lodash.debounce');
const Multispinner = require('multispinner');
const path = require('path');
const StreamSnitch = require('stream-snitch');

const warn = (msg, ...args) => {
    console.warn(
        chalk.yellowBright(`\n  ${figures.warning}  ${msg}\n`),
        ...args
    );
};

const gracefulExit = () => {
    warn('Exiting watch mode.');
    process.exit(0);
};

process.on('SIGINT', gracefulExit);

function afterEmit(childProcess, regex, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, timeout);
        const snitch = new StreamSnitch(regex);
        snitch.on('match', () => {
            clearTimeout(timeoutId);
            resolve();
        });
        childProcess.stdout.pipe(snitch);
        childProcess.stderr.pipe(snitch);
        childProcess.on('error', reject);
    });
}

function whenQuiet(childProcess, timeout = 1000) {
    return new Promise((resolve, reject) => {
        childProcess.on('error', reject);
        childProcess.on(
            'close',
            code =>
                code === 0 ||
                reject(
                    new Error(
                        `${childProcess.pid} exited abnormally, code ${code}`
                    )
                )
        );

        // wait until stdout is quiet for a while before resolving this promise.
        const resolveDebounced = debounce(() => {
            // emit stderr so if the process exits abnormally, the error
            // displays in console
            childProcess.stderr.on('data', () => resolveDebounced());
            childProcess.stderr.pipe(process.stderr);
            resolve();
        }, timeout);
        childProcess.stdout.on('data', () => resolveDebounced());
    });
}

const rootDir = path.resolve(__dirname, '..');

const localDir = path.join(rootDir, 'node_modules/.bin');

const mustWatch = ['@magento/pwa-buildpack', '@magento/peregrine'];

const restartDevServerOnChange = [
    'packages/pwa-buildpack/dist/**/*.js',
    'packages/upward-js/lib/**/*.js',
    'packages/venia-concept/*.{js,json,yml}',
    'packages/venia-concept/.env',
    'packages/venia-concept/templates/**/*',
    'yarn.lock'
];

const spinner = new Multispinner([...mustWatch, 'webpack-dev-server'], {
    preText: 'initial build of'
});

const eventBuffer = [];

function summarizeEvents() {
    const typeMap = eventBuffer.reduce(
        (summaries,
        ({ name }) => {
            summaries[name] = (summaries[name] || 0) + 1;
        },
        {})
    );

    return Object.entries(typeMap).map(([name, value]) => ({
        name,
        file: `${value} files`
    }));
}

let devServer;
function startDevServer() {
    eventBuffer.length = 0;
    devServer = execa(
        'webpack-dev-server',
        ['--stdin', '--no-progress', '--color', '--env.mode', 'development'],
        {
            cwd: path.join(rootDir, 'packages/venia-concept'),
            localDir: path.join(rootDir, 'node_modules/.bin')
        }
    );
    devServer.on('exit', () => {
        devServer.exited = true;
    });
    devServer.stdout.pipe(process.stdout);
    devServer.stderr.pipe(process.stderr);
    afterEmit(devServer, /Compiled successfully/)
        .then(() => whenQuiet(devServer, 6000))
        .then(() => {
            // make `process.stdin` begin emitting "keypress" events
            keypress(process.stdin);

            // listen for the "keypress" event
            process.stdin.on('keypress', function(_, key) {
                if (!key) {
                    return;
                }
                if (key.name === 'q' || (key.name === 'c' && key.ctrl)) {
                    gracefulExit();
                }
            });

            process.stdin.setRawMode(true);
            process.stdin.resume();

            warn(`Press ${chalk.green.bold('q')} to exit the dev server.`);
        })
        .catch(e => {
            console.error(`Could not setup devServer: ${e.toString()}`);
        });
}

let isClosing = false;
const runVeniaWatch = debounce(() => {
    if (!devServer) {
        warn('Launching webpack-dev-server');
        return startDevServer();
    }
    const fileSummary =
        eventBuffer.length > 20 ? summarizeEvents() : eventBuffer;
    warn(
        `Relaunching webpack-dev-server due to: \n  - ${fileSummary
            .map(
                ({ name, file }) =>
                    `${chalk.yellow(name)} ${chalk.whiteBright(file)}`
            )
            .join('\n  - ')}\n`
    );
    if (devServer.exited) {
        return startDevServer();
    }
    if (!isClosing) {
        devServer.on('close', () => {
            isClosing = false;
            devServer = false;
            startDevServer();
        });
        isClosing = true;
        devServer.kill();
    }
}, 800);

function runOnPackages(packages, cmd) {
    const scopeArg =
        packages.length > 1 ? `{${packages.join(',')}}` : packages[0];
    return execa(
        'lerna',
        ['--loglevel=error', '--stream', `--scope=${scopeArg}`, 'run', cmd],
        {
            localDir
        }
    );
}

function watchDependencies() {
    return whenQuiet(runOnPackages(mustWatch, 'watch')).then(
        () => mustWatch.forEach(dep => spinner.success(dep)),
        e => {
            mustWatch.forEach(dep => spinner.error(dep));
            throw e;
        }
    );
}

function watchRestartRequirements() {
    return chokidar.watch(restartDevServerOnChange, {
        ignored: '**/__*__/**/*'
    });
}

function watchVeniaWithRestarts() {
    const eventsToListenTo = ['add', 'change', 'unlink'];
    const watcher = watchRestartRequirements();
    const enqueue = (name, file) => {
        eventBuffer.push({ name, file });
        runVeniaWatch();
    };
    // chokidar appears not to have `.removeEventListener`, so this is the next
    // best thing: just reassign functions.
    let handler = debounce(() => {
        spinner.success('webpack-dev-server');
        handler = enqueue;
        runVeniaWatch();
    }, 900);

    eventsToListenTo.forEach(name =>
        watcher.on(name, file => handler(name, file))
    );
}

watchDependencies()
    .then(watchVeniaWithRestarts)
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
