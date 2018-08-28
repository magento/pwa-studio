const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { promisify } = require('util');
const { URL } = require('url');
const access = promisify(fs.access);

class ServerRunner {
    constructor(script, serverTimeout) {
        this.script = script;
        this.serverTimeout = serverTimeout;
    }
    async checkPermissions() {
        try {
            await access(this.script, fs.constants.X_OK);
        } catch (e) {
            throw Error(
                e.message +
                    `\n\n\tMake sure ${this.script} has executable permissions.`
            );
        }
    }
    async run(upwardPath, env = {}) {
        // Create a child process and resolve the Promise if:
        // - the process exits (with any code)
        // - the process stays alive and echoes a URL

        // Reject only if:
        // - the process throws an error and cannot start
        // - the process takes too long without echoing a valid URL
        return new Promise((resolve, reject) => {
            const child = spawn(path.resolve(this.script), {
                env: Object.assign({}, env, {
                    UPWARD_PATH: upwardPath
                })
            });

            let stderr = '';
            child.stderr.on('data', chunk => {
                stderr += chunk.toString('utf8');
            });

            function emitCrashedServer(exitCode) {
                resolve({
                    crashed: true,
                    exitCode,
                    stderr
                });
            }

            function terminateClean() {
                child.removeAllListeners();
                child.on('error', () => child.kill('SIGKILL'));
                return new Promise((innerResolve, innerReject) => {
                    child.on(
                        'close',
                        (_, signal) =>
                            signal === 'SIGKILL'
                                ? innerReject(signal)
                                : innerResolve(signal)
                    );
                    child.kill('SIGTERM');
                });
            }

            function emitLaunchedServer(url) {
                resolve({
                    crashed: false,
                    close: terminateClean,
                    url
                });
            }

            const launchTimeout = setTimeout(() => {
                const message = `Timed out. Spawning a server with ${
                    this.script
                } took over ${this.serverTimeout} seconds.`;
                terminateClean()
                    .then(
                        signal => ` Killed with ${signal}`,
                        signal =>
                            `\n\nAdditionally, the process did not respond to SIGTERM, and had to be killed with ${signal}.`
                    )
                    .then(notice => reject(new Error(message + notice)));
            }, this.serverTimeout * 1000);

            child.on('error', reject);
            child.on('close', emitCrashedServer);

            let outText = '';
            child.stdout.on('data', function waitingForUrl(chunk) {
                outText = (outText + chunk.toString('utf8')).trim();
                if (outText.includes('\n')) {
                    const url = new URL(outText);
                    clearTimeout(launchTimeout);
                    child.stdout.removeListener('data', waitingForUrl);
                    emitLaunchedServer(url);
                }
            });
        });
    }
}

module.exports = ServerRunner;
