const path = require('path');
const { spawn } = require('child_process');
const { URL } = require('url');

const script = process.env.UPWARD_SERVER_SCRIPT_PATH;

module.exports = async function runServer(
    test,
    configFile,
    env,
    customTimeout
) {
    let terminator;
    let timeout = Number(customTimeout || process.env.TAP_TIMEOUT);
    if (isNaN(timeout)) {
        timeout = 5;
    } else {
        timeout = Math.max(timeout - 1, Math.min(timeout - 1, 2));
    }
    // Create a child process and resolve the Promise if:
    // - the process exits (with any code)
    // - the process stays alive and echoes a URL

    // Reject only if:
    // - the process throws an error and cannot start
    // - the process takes too long without echoing a valid URL
    let server;
    try {
        server = await new Promise((resolve, reject) => {
            let child;
            const flags = {
                crashed: false,
                launched: false,
                running: false
            };
            let stderr = '';
            let url;

            function terminateClean() {
                child.removeAllListeners();
                child.on('error', () => {
                    child.kill('SIGKILL');
                });
                return new Promise((innerResolve, innerReject) => {
                    child.on('close', (_, signal) => {
                        flags.running = false;
                        return signal === 'SIGKILL'
                            ? innerReject(signal)
                            : innerResolve(signal);
                    });
                    child.kill('SIGTERM');
                });
            }

            try {
                child = spawn(path.resolve(script), {
                    cwd: path.dirname(script),
                    env: Object.assign(
                        {},
                        process.env,
                        {
                            UPWARD_PATH: configFile
                        },
                        env
                    )
                });
            } catch (e) {
                reject(e);
                return;
            }

            child.stderr.on('data', chunk => {
                stderr += chunk.toString('utf8');
            });

            if (timeout > 0) {
                terminator = setTimeout(() => {
                    const message = `Timed out. Spawning a server with ${script} took over ${timeout} seconds.`;
                    terminateClean()
                        .then(
                            signal => ` Killed with ${signal}`,
                            signal =>
                                `\n\nAdditionally, the process did not respond to SIGTERM, and had to be killed with ${signal}.`
                        )
                        .then(notice => reject(new Error(message + notice)));
                }, timeout * 1000);
            }

            function emitServer() {
                clearTimeout(terminator);
                resolve({
                    stderr,
                    url,
                    hasCrashed() {
                        return flags.crashed;
                    },
                    hasLaunched() {
                        return flags.launched;
                    },
                    isRunning() {
                        return flags.running;
                    },
                    async close() {
                        if (flags.running) {
                            return terminateClean().catch(e => test.error(e));
                        }
                    },
                    assert(flag, expected = true, msg) {
                        const extra = msg ? `\n\n${msg}` : '';
                        let message = 'server ';
                        if (!flags[flag]) {
                            message += 'not ';
                        }
                        message += flag;
                        if (flag === 'launched' && url) {
                            message += `, listening at ${url}`;
                        }
                        if (stderr) {
                            message += `, emitting stderr ${stderr.slice(
                                0,
                                50
                            )}[...]`;
                        }
                        const status =
                            flags[flag] === expected ? 'pass' : 'fail';
                        test[status](message + extra);
                        return status === 'pass';
                    }
                });
            }

            child.on('error', reject);
            child.on('exit', code => {
                flags.running = false;
                if (code !== 0) {
                    flags.crashed = true;
                }
                emitServer();
            });

            let outText = '';
            child.stdout.on('data', function waitingForUrl(chunk) {
                const newChunk = chunk.toString('utf8');
                outText += newChunk;
                if (outText.includes('\n')) {
                    child.stdout.removeListener('data', waitingForUrl);
                    try {
                        url = new URL(outText.trim());
                        flags.launched = true;
                        flags.running = true;
                        emitServer();
                    } catch (e) {
                        reject(
                            new Error(
                                `Could not parse first line of server stdout as a URL: ${e} ${outText}`
                            )
                        );
                    }
                }
            });
        });
    } catch (e) {
        clearTimeout(terminator);
        test.threw(e);
        throw e;
    }

    return server;
};
