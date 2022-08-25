require('events').EventEmitter.defaultMaxListeners = 100;

const chalk = require('chalk');
const chokidar = require('chokidar');
const execa = require('execa');
const figures = require('figures');
const debounce = require('lodash.debounce');
const path = require('path');

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

const rootDir = path.resolve(__dirname, '..');

const restartDevServerOnChange = [
    'packages/pwa-buildpack/lib/**/*.js',
    'packages/upward-js/lib/**/*.js',
    'packages/venia-*/*.{js,json,yml}',
    'packages/venia-*/.env',
    'packages/venia-*/static/**/*',
    'yarn.lock'
];

const eventBuffer = [];

/**
 * Summarizes a buffer of event objects into an object of event object format.
 *
 * @returns [Array] like [{ name: "change", file: "10 file(s)"}, { name: "unlink", file: "2 file(s)"]
 */
function summarizeEvents() {
    const typeMap = eventBuffer.reduce((summaries, { name }) => {
        summaries[name] = (summaries[name] || 0) + 1;
        return summaries;
    }, {});

    return Object.entries(typeMap).map(([name, value]) => ({
        name,
        file: `${value} file(s)`
    }));
}

let devServer;
function startDevServer() {
    eventBuffer.length = 0;
    devServer = execa(
        'webpack-dev-server',
        ['--stdin', '--progress', '--color', '--env.mode', 'development'],
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
        devServer.stdout.unpipe(process.stdout);
        devServer.stderr.unpipe(process.stderr);
        devServer.kill();
    }
}, 800);

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
        handler = enqueue;
        runVeniaWatch();
    }, 900);

    eventsToListenTo.forEach(name =>
        watcher.on(name, file => handler(name, file))
    );
}

watchVeniaWithRestarts();
